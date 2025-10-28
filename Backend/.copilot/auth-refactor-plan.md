# Plan Refaktoryzacji na Wzorzec "Features" (MediatR)

Oto konkretny plan refaktoryzacji Twojej aplikacji z wzorca serwisowego na wzorzec **CQRS z MediatR** (czyli "Features").

Ten plan zakłada, że celem jest usunięcie `IAuthService` / `AuthService` i przeniesienie całej logiki biznesowej do handlerów w warstwie `Application`.

---

## Faza 0: Konfiguracja Narzędzi

1.  **Zainstaluj Paczki NuGet:**
    * W projekcie `Application`: `MediatR`
    * W projekcie `Api`: `MediatR.Extensions.Microsoft.DependencyInjection`

2.  **Zarejestruj MediatR:**
    * Otwórz plik `Program.cs` w projekcie `Api`.
    * Znajdź sekcję `builder.Services...` i dodaj:
        ```csharp
        // Załóżmy, że masz plik DependencyInjection.cs w Application
        builder.Services.AddMediatR(typeof(Application.DependencyInjection).Assembly);
        
        // Jeśli nie, stwórz publiczną pustą klasę w Application: public class AssemblyReference {}
        // i użyj: builder.Services.AddMediatR(typeof(Application.AssemblyReference).Assembly);
        ```

---

## Faza 1: Krytyczne Przeniesienie Interfejsu (`IJwtService`)

Zanim zaczniemy, musimy naprawić błąd architektoniczny. Handler w `Application` nie może zależeć od implementacji w `Infrastructure`.

1.  **Przenieś Interfejs:**
    * Znajdź plik `Infrastructure/Services/JWT/JwtService.cs`.
    * **Wytnij** samą definicję interfejsu: `public interface IJwtService { ... }`
    * **Wklej** ją do nowego pliku `Application/Interfaces/IJwtService.cs`.

2.  **Popraw Zależności:**
    * W `Infrastructure/Services/JWT/JwtService.cs`, upewnij się, że klasa implementuje interfejs z nowej lokalizacji:
        ```csharp
        using Application.Interfaces;
        
        public class JwtService : IJwtService 
        {
            // ...
        }
        ```
    * W `Infrastructure/DependencyInjection.cs`, popraw rejestrację, aby używała pełnych nazw (lub dodaj `using Application.Interfaces;`):
        ```csharp
        // Zmień to:
        // services.AddScoped<IJwtService, JwtService>();
        
        // Na to:
        services.AddScoped<Application.Interfaces.IJwtService, Infrastructure.Services.JwtService>();
        ```

---

## Faza 2: Refaktoryzacja `RegisterAsync` (jako szablon)

1.  **Stwórz Command (Komendę):**
    * W `Application/Features/Authentication/` stwórz folder `Register`.
    * Stwórz plik `Application/Features/Authentication/Register/RegisterCommand.cs`:

    ```csharp
    using Application.DTOs.Auth;
    using MediatR;

    namespace Application.Features.Authentication.Register;

    // Komenda zawiera dane potrzebne do wykonania akcji.
    // Możemy dziedziczyć po DTO lub skopiować pola.
    public class RegisterCommand : RegisterRequest, IRequest<AuthResponse>
    {
        // RegisterRequest ma już Name, Email, Password itd.
    }
    ```

2.  **Stwórz Handler (Logikę):**
    * Stwórz plik `Application/Features/Authentication/Register/RegisterCommandHandler.cs`:

    ```csharp
    using Application.DTOs.Auth;
    using Application.Interfaces; // Ważne - dla IJwtService
    using Domain.Entities;
    using MediatR;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;

    namespace Application.Features.Authentication.Register;
    
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        // Wstrzyknij zależności, których potrzebowała metoda RegisterAsync
        private readonly UserManager<User> _userManager;
        private readonly IJwtService _jwtService;
        private readonly ILogger<RegisterCommandHandler> _logger;

        public RegisterCommandHandler(
            UserManager<User> userManager,
            IJwtService jwtService,
            ILogger<RegisterCommandHandler> logger)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _logger = logger;
        }

        public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            // === POCZĄTEK: Logika skopiowana z AuthService.RegisterAsync ===
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                PhoneNumber = request.Phone
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create user: {errors}");
            }

            await _userManager.AddToRoleAsync(user, "Guest");

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtService.GenerateAccessToken(user, roles);
            var refreshToken = _jwtService.GenerateRefreshToken(user);

            _logger.LogInformation("User {Email} registered successfully", request.Email);

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15), 
                User = new UserInfo
                {
                    Id = user.Id, // Zakładając, że User.Id to string w encji
                    Name = user.Name,
                    Surname = user.Surname,
                    Phone = user.PhoneNumber ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    ProfilePictureUrl = user.ProfilePictureUrl,
                    Roles = roles.ToList()
                }
            };
            // === KONIEC: Logika skopiowana z AuthService.RegisterAsync ===
        }
    }
    ```

---

## Faza 3: Aktualizacja `AuthController`

1.  **Wstrzyknij `IMediator`:**
    * Otwórz `Api/Controllers/AuthController.cs`.
    * Usuń `IAuthService` z konstruktora.
    * Wstrzyknij `IMediator`.

    ```csharp
    using MediatR;
    // ...

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // Zamiast IAuthService
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }
        
        // ... reszta metod
    }
    ```

2.  **Zaktualizuj Metodę `Register`:**
    * Zastąp wywołanie serwisu wysłaniem komendy.

    ```csharp
    using Application.Features.Authentication.Register;
    // ...

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    // ... reszta atrybutów
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        // Stwórz komendę na podstawie requestu DTO
        // (Jeśli RegisterCommand dziedziczy po RegisterRequest, potrzebny będzie mapper
        // lub ręczne przepisanie pól)

        var command = new RegisterCommand
        {
            Email = request.Email,
            Password = request.Password,
            ConfirmPassword = request.ConfirmPassword,
            Name = request.Name,
            Surname = request.Surname,
            Phone = request.Phone
        };
        
        // Wyślij komendę do MediatR
        var response = await _mediator.Send(command);
        return Ok(response);
    }
    ```

---

## Faza 4: Powtórzenie Procesu (dla reszty metod)

Teraz wykonaj kroki z **Fazy 2 i 3** dla pozostałych metod `AuthService`:

1.  **LoginAsync:**
    * Stwórz `Application/Features/Authentication/Login/LoginQuery.cs` (to jest *Query* - zapytanie, nie zmienia stanu).
    * Implementacja: `public class LoginQuery : LoginRequest, IRequest<AuthResponse> {}`
    * Stwórz `LoginQueryHandler.cs` (wstrzyknie `UserManager`, `SignInManager`, `IJwtService`).
    * Skopiuj logikę z `AuthService.LoginAsync`.
    * Zaktualizuj metodę `Login` w `AuthController`, by wysyłała `LoginQuery`.

2.  **RefreshTokenAsync:**
    * Stwórz `Application/Features/Authentication/Refresh/RefreshTokenCommand.cs`.
    * Implementacja: `public class RefreshTokenCommand : RefreshTokenRequest, IRequest<AuthResponse> {}`
    * Stwórz `RefreshTokenCommandHandler.cs` (wstrzyknie `UserManager`, `IJwtService`).
    * Skopiuj logikę z `AuthService.RefreshTokenAsync`.
    * Zaktualizuj metodę `RefreshToken` w `AuthController`, by wysyłała `RefreshTokenCommand`.

3.  **PromoteToHostAsync:**
    * Stwórz `Application/Features/Authentication/PromoteToHost/PromoteToHostCommand.cs`.
    * Ta komenda potrzebuje ID użytkownika. Kontroler pobierze je z Claima.
        ```csharp
        using Application.DTOs.Auth;
        using MediatR;
        
        public class PromoteToHostCommand : IRequest<AuthResponse>
        {
            public string UserId { get; set; }
        }
        ```
    * Stwórz `PromoteToHostCommandHandler.cs` (wstrzyknie `UserManager`, `IJwtService`).
    * Skopiuj logikę z `AuthService.PromoteToHostAsync`.
    * Zaktualizuj metodę `PromoteToHost` w `AuthController`:
        ```csharp
        using Application.Features.Authentication.PromoteToHost;
        // ...

        [HttpPost("promote-to-host")]
        [Authorize(Policy = "GuestOnlyPolicy")]
        public async Task<ActionResult<AuthResponse>> PromoteToHost()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var command = new PromoteToHostCommand { UserId = userId };
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        ```

4.  **GetCurrentUserAsync:**
    * Stwórz `Application/Features/Authentication/GetCurrentUser/GetCurrentUserQuery.cs`.
    * Potrzebuje `UserId`:
        ```csharp
        using Application.DTOs.Auth;
        using MediatR;
        
        public class GetCurrentUserQuery : IRequest<UserInfo> // Zwraca tylko UserInfo
        {
            public string UserId { get; set; }
        }
        ```
    * Stwórz `GetCurrentUserQueryHandler.cs` (wstrzyknie `UserManager`).
    * Skopiuj logikę z `AuthService.GetCurrentUserAsync`.
    * Zaktualizuj metodę `GetCurrentUser` w `AuthController`:
        ```csharp
        using Application.Features.Authentication.GetCurrentUser;
        // ...
        
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserInfo>> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var query = new GetCurrentUserQuery { UserId = userId };
            var userInfo = await _mediator.Send(query);
            return Ok(userInfo);
        }
        ```

---

## Faza 5: Ostateczne Czyszczenie

Gdy wszystkie metody w `AuthController` używają `IMediator` i wszystko działa:

1.  **Usuń pliki:**
    * `Application/Interfaces/IAuthService.cs`
    * `Infrastructure/Services/AuthService.cs`
2.  **Zaktualizuj `Infrastructure/DependencyInjection.cs`:**
    * Usuń linię: `services.AddScoped<Application.Interfaces.IAuthService, AuthService>();`
3.  **Gotowe!** Twój projekt teraz poprawnie implementuje wzorzec CQRS / Features w warstwie `Application`.