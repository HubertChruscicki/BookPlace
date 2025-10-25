# BookPlace Backend - Copilot Instructions

## 🚨 ZASADY FUNDAMENTALNE - BEZWZGLĘDNIE PRZESTRZEGAJ

### ✅ ZAWSZE:
- **ZAWSZE Clean Architecture**: Logika biznesowa TYLKO w Application/Domain, kontrolery TYLKO routing HTTP
- **ZAWSZE Authorization Policies**: Używaj `[Authorize(Policy = "PolicyName")]` dla resource-based authorization
- **ZAWSZE XML Summary**: Każda publiczna metoda/klasa MUSI mieć `/// <summary>` dokumentację
- **ZAWSZE Required Messages**: Wszystkie `[Required]` z `ErrorMessage = "..."`
- **ZAWSZE Middleware**: Globalna obsługa błędów przez `GlobalExceptionHandlingMiddleware`
- **ZAWSZE Dependency Injection**: Rejestruj serwisy w `DependencyInjection.cs` (Infrastructure)
- **ZAWSZE Async/Await**: Wszystkie operacje IO są asynchroniczne
- **ZAWSZE Entity Framework**: Używaj Include() dla related data, ConfigureAwait(false) nie jest potrzebne
- **ZAWSZE JWT Claims**: Używaj `ClaimTypes.NameIdentifier` dla userId
- **ZAWSZE Exceptions**: Rzucaj domenowe wyjątki (`UnauthorizedAccessException`, `InvalidOperationException`) zamiast return null

### ❌ NIGDY:
- **NIGDY Try-catch w kontrolerach** - middleware obsługuje wszystkie wyjątki
- **NIGDY Logika biznesowa w kontrolerach** - deleguj do serwisów Application layer
- **NIGDY Direct DbContext w kontrolerach** - używaj repozytoriów/serwisów
- **NIGDY Magic strings** - używaj constów lub enums
- **NIGDY Nulls zamiast wyjątków** - rzucaj wyjątki dla błędów biznesowych
- **NIGDY Sprawdzanie `userId` w kontrolerach z `[Authorize]`** - policy/middleware to robi
- **NIGDY Hardcodowane connection stringi** - używaj IConfiguration
- **NIGDY Synchroniczne operacje IO** - wszystko async/await

### 🎯 TYLKO:
- **TYLKO Controllers**: HTTP routing + delegacja do serwisów + return ActionResult
- **TYLKO Application Services**: Logika biznesowa + walidacja + orchestracja
- **TYLKO Domain Entities**: Podstawowa logika biznesowa + value objects
- **TYLKO Infrastructure**: Implementacje interfejsów + external services + database
- **TYLKO Handlers**: Authorization logic dla konkretnych resources
- **TYLKO Requirements**: Marker interfaces dla authorization policies

---

## 🏗️ Clean Architecture - Patterns & Best Practices

### Dependency Flow (ZAWSZE przestrzegaj):
```
Api → Application → Domain ← Infrastructure
```
- **Api** - references Application
- **Application** - references Domain (interfaces only)
- **Infrastructure** - references Application + Domain (implementations)
- **Domain** - NO external dependencies (pure business logic)

### Layer Responsibilities:

#### 🎮 **API Layer** (Presentation):
```csharp
[ApiController]
public class OffersController : ControllerBase
{
    private readonly IOfferService _offerService;
    
    [Authorize(Policy = "HostOnlyPolicy")]
    public async Task<ActionResult<OfferResponse>> CreateOffer(CreateOfferRequest request)
    {
        var response = await _offerService.CreateOfferAsync(request);
        return Ok(response);
    }
}
```
- **TYLKO**: HTTP concerns, routing, authorization attributes
- **NIGDY**: Business logic, database calls, validation logic

#### 🧠 **Application Layer** (Use Cases):
```csharp
public interface IOfferService
{
    Task<OfferResponse> CreateOfferAsync(CreateOfferRequest request);
}

public class OfferService : IOfferService
{
    public async Task<OfferResponse> CreateOfferAsync(CreateOfferRequest request)
    {
        // ✅ Business logic, validation, orchestration
        // ✅ Call repositories, external services
        // ✅ Map between DTOs and Entities
    }
}
```
- **ZAWSZE**: Business logic, validation, orchestration
- **UŻYWAJ**: DTOs, interfaces, dependency injection

#### 🏛️ **Domain Layer** (Core Business):
```csharp
public class Offer
{
    public void Archive()
    {
        if (Status != OfferStatus.Active)
            throw new InvalidOperationException("Only active offers can be archived");
        
        IsArchive = true;
        Status = OfferStatus.Inactive;
    }
}
```
- **TYLKO**: Pure business logic, domain rules, entities
- **NIGDY**: External dependencies, HTTP, database

#### 🔧 **Infrastructure Layer** (Technical Details):
```csharp
public class OfferRepository : IOfferRepository
{
    private readonly ApplicationDbContext _context;
    
    public async Task<Offer> GetByIdAsync(int id)
    {
        return await _context.Offers
            .Include(o => o.Photos)
            .Include(o => o.Amenities)
            .FirstOrDefaultAsync(o => o.Id == id);
    }
}
```
- **IMPLEMENTUJE**: Interfaces z Application/Domain
- **ZAWIERA**: Database, external APIs, file system

### Authorization Architecture:

#### 🔐 **Requirements** (Application Layer):
```csharp
public class OfferOwnerRequirement : IAuthorizationRequirement { }
```

#### 🛡️ **Handlers** (Infrastructure Layer):
```csharp
public class OfferOwnerAuthorizationHandler : AuthorizationHandler<OfferOwnerRequirement, Offer>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OfferOwnerRequirement requirement,
        Offer resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (resource.HostId == userId)
            context.Succeed(requirement);
        
        return Task.CompletedTask;
    }
}
```

#### 🎯 **Usage** (API Layer):
```csharp
[Authorize(Policy = "OfferOwnerPolicy")]
public async Task<IActionResult> UpdateOffer(int id, UpdateOfferRequest request)
{
    // Authorization handler już sprawdził czy user == offer.HostId
    await _offerService.UpdateOfferAsync(id, request);
    return Ok();
}
```

### Exception Handling Pattern:

#### 🚨 **Middleware** (API Layer):
```csharp
public class GlobalExceptionHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { message = ex.Message }));
        }
    }
}
```

#### 💥 **Service Layer** (Application):
```csharp
public async Task<OfferResponse> GetOfferAsync(int id)
{
    var offer = await _offerRepository.GetByIdAsync(id);
    if (offer == null)
        throw new InvalidOperationException("Offer not found");
    
    if (offer.IsArchive)
        throw new UnauthorizedAccessException("Cannot access archived offer");
    
    return _mapper.Map<OfferResponse>(offer);
}
```

### Validation & DTOs Pattern:

#### 📝 **Request DTOs** (Application Layer):
```csharp
public class CreateOfferRequest
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(5, ErrorMessage = "Title must be at least 5 characters")]
    public string Title { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Price per night is required")]
    [Range(1, 10000, ErrorMessage = "Price must be between 1 and 10000")]
    public decimal PricePerNight { get; set; }
}
```

#### ✅ **Automatic Validation** (API Layer):
```csharp
[ApiController] // Automatically validates model state
public class OffersController : ControllerBase
{
    public async Task<ActionResult> CreateOffer(CreateOfferRequest request)
    {
        // Model validation już się wykonała automatycznie
        // Jeśli błąd walidacji = automatyczny 400 BadRequest
    }
}
```

## 📏 Code Quality Standards

### Documentation Requirements:
```csharp
/// <summary>
/// Authenticates user credentials and generates JWT tokens for valid login attempts.
/// </summary>
/// <param name="request">Login request containing email and password</param>
/// <returns>Authentication response with JWT tokens and user information</returns>
/// <exception cref="UnauthorizedAccessException">Thrown when credentials are invalid</exception>
public async Task<AuthResponse> LoginAsync(LoginRequest request)
```

- **ZAWSZE**: `<summary>` dla wszystkich public methods/classes
- **DODAWAJ**: `<param>`, `<returns>`, `<exception>` gdzie odpowiednie
- **OPIS**: Co robi metoda, nie jak to robi

### Validation Message Standards:
```csharp
[Required(ErrorMessage = "Email is required")]
[EmailAddress(ErrorMessage = "Invalid email format")]
[MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
[Compare("Password", ErrorMessage = "Password and confirmation password do not match")]
```

### Error Response Format:
```json
{
  "message": "User with this email already exists",
  "statusCode": 400,
  "timestamp": "2024-10-25T10:30:00Z"
}
```

### Naming Conventions:
- **Controllers**: `{Entity}Controller` (e.g., `OffersController`)
- **Services**: `I{Entity}Service` + `{Entity}Service` (e.g., `IOfferService`, `OfferService`)
- **DTOs**: `{Action}{Entity}Request/Response` (e.g., `CreateOfferRequest`)
- **Policies**: `{Purpose}Policy` (e.g., `OfferOwnerPolicy`)
- **Requirements**: `{Purpose}Requirement` (e.g., `OfferOwnerRequirement`)
- **Handlers**: `{Purpose}AuthorizationHandler` (e.g., `OfferOwnerAuthorizationHandler`)

### HTTP Status Codes:
- **200 OK**: Successful GET, PUT
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Validation errors, business rule violations
- **401 Unauthorized**: Authentication failed
- **403 Forbidden**: Authorization failed (logged in but no permission)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Unhandled exceptions

### Performance Guidelines:
- **Include related data**: `Include(o => o.Photos).Include(o => o.Amenities)`
- **Use async/await**: All I/O operations must be asynchronous
- **Pagination**: Large datasets must be paginated
- **Select only needed columns**: Use projections for large entities
- **Cache frequently accessed data**: Consider caching for reference data

---

## Opis Projektu
BookPlace Backend to aplikacja .NET 8.0 zbudowana w architekturze Clean Architecture, przeznaczona do platformy rezerwacji noclegów.

### 🏠 Główne Funkcjonalności

**Rezerwacje i Oferty:**
- System rezerwacji noclegów z zarządzaniem dostępnością
- Oferty zawierają szczegółowe informacje: lokalizację, udogodnienia, typ nieruchomości, zdjęcia
- Typy ofert: willa, apartament, dom, hotel, itp.
- Galeria zdjęć przechowywana lokalnie w plikach (z systemem miniatur i skalowania)
- Zarządzanie udogodnieniami (Wi-Fi, parking, basen, itp.)

**System Opinii:**
- Opinie przypisane do konkretnych ofert po zakończonej rezerwacji
- Możliwość dodawania zdjęć do opinii

**Archiwizacja i Soft Delete:**
- **Offer.IsArchive** - proste pole boolean do archiwizacji ofert (default: false)
- **Booking Soft Delete** - używa statusów `CancelledByHost` i `CancelledByGuest` zamiast pola IsDeleted
- Anulowane rezerwacje pozostają w bazie danych dla celów raportowania i historii

**Komunikacja (Chat/WebSocket):**
- Historia wiadomości między gośćmi a gospodarzami
- Komunikacja w czasie rzeczywistym przez WebSocket
- Konwersacje przypisane do:
  - Konkretnej oferty (gość ↔ gospodarz)
  - Konkretnej opinii (użytkownik ↔ autor opinii)
- Struktura: Conversation → Messages z wieloma uczestnikami (tutaj akurat zawsze dwóch)

### 📸 Zarządzanie Zdjęciami
- Przechowywanie plików lokalnie w folderze aplikacji
- Automatyczne generowanie miniatur w różnych rozmiarach
- Wsparcie dla formatów: JPEG, PNG, WebP
- Kompresja i optymalizacja jakości obrazów
- Metadane zdjęć w bazie danych (ścieżka, rozmiar, kolejność)

### 🚌 MassTransit & Message Broker
- **MassTransit 8.5.4** z RabbitMQ jako transport
- **Assembly scanning** dla automatycznego rejestrowania konsumentów
- **Retry policy** z exponential backoff (3 próby, interwał 1-30s)
- **Events & Consumers** w folderze Infrastructure/Services/
- Konfiguracja w appsettings.json z username/password
- Zmienne środowiskowe w Docker Compose dla RabbitMQ

## Architektura

Projekt zastosowuje **Clean Architecture** (Onion Architecture)

### 📁 Struktura Folderów

```
Backend/
├── src/                          # Kod źródłowy aplikacji
│   ├── Api/                      # Warstwa Prezentacji (Web API)
│   │   ├── Controllers/          # Kontrolery API
│   │   ├── Middleware/           # Middleware HTTP
│   │   ├── Program.cs            # Punkt wejścia aplikacji
│   │   └── appsettings.json      # Konfiguracja aplikacji
│   │
│   ├── Application/              # Warstwa Aplikacji (Use Cases)
│   │   ├── DTOs/                 # Data Transfer Objects
│   │   ├── Features/             # Feature-based organizacja (CQRS)
│   │   ├── Interfaces/           # Interfejsy warstwy aplikacji
│   │   ├── Mappings/             # Mapowania między obiektami
│   │   └── Exceptions/           # Wyjątki specyficzne dla aplikacji
│   │
│   ├── Domain/                   # Warstwa Domeny (Core Business Logic)
│   │   ├── Entities/             # Encje domenowe
│   │   ├── ValueObjects/         # Obiekty wartości
│   │   ├── Enums/                # Wyliczenia domenowe
│   │   ├── Interfaces/           # Interfejsy domenowe (repozytoria)
│   │   └── Exceptions/           # Wyjątki domenowe
│   │
   └── Infrastructure/           # Warstwa Infrastruktury
       ├── Persistance/          # Dostęp do danych
       │   ├── Configurations/   # Konfiguracje Entity Framework
       │   ├── Migrations/       # Migracje bazy danych
       │   └── Repositories/     # Implementacje repozytoriów
       └── Services/             # Usługi zewnętrzne
           ├── Events/           # Eventy MassTransit
           └── Consumers/        # Konsumenci MassTransit
│
├── tests/                        # Testy jednostkowe i integracyjne
│   ├── Api.Tests/                # Testy warstwy API
│   ├── Application.Tests/        # Testy warstwy aplikacji
│   ├── Domain.Tests/             # Testy warstwy domeny
│   └── Infrastructure.Tests/     # Testy warstwy infrastruktury
│
├── docker-compose.yaml           # Konfiguracja Docker Compose
├── Dockerfile                    # Definicja obrazu Docker
└── Backend.sln                   # Solution Visual Studio
```

#### Technologie:
- **.NET 8.0** - Platforma aplikacji
- **ASP.NET Core Web API 8.0** - Framework webowy
- **Entity Framework Core 8.0.10/8.0.11** - ORM
- **PostgreSQL (Npgsql.EntityFrameworkCore.PostgreSQL 8.0.4)** - Baza danych
- **MassTransit 8.5.4** - Service Bus / Message Broker
- **RabbitMQ 4.1-management** - Message Broker
- **Docker** - Konteneryzacja
- **Swagger/OpenAPI** - Dokumentacja API
- **ASP.NET Identity (Microsoft.AspNetCore.Identity 2.3.1)** - Autoryzacja i uwierzytelnianie

## Schemat Bazy Danych

### ASP.NET Identity (rozszerzone)
```
AspNetUsers - rozszerzone o: Name, ProfilePictureUrl
AspNetRoles - standardowe
AspNetUserRoles - standardowe
```

### Główne Encje
```
OfferType
├── Id (PK)
└── Name

Amenity
├── Id (PK)
└── Name

Offer
├── Id (PK)
├── HostId (FK → AspNetUsers)
├── OfferTypeId (FK → OfferType) 
├── Title, Description
├── PricePerNight, MaxGuests, Bedrooms, Bathrooms
├── Status (OfferStatus enum)
├── IsArchive (boolean, default: false)
└── Address_* (Street, City, ZipCode, Country, Latitude, Longitude)

AmenityOffer (automatyczna tabela łączącą - EF Core)
├── AmenitiesId (FK → Amenity)
└── OffersId (FK → Offer)

OfferPhoto
├── Id (PK)
├── OfferId (FK → Offer)
├── Url
├── IsCover
└── SortOrder

Booking
├── Id (PK)
├── GuestId (FK → AspNetUsers)
├── OfferId (FK → Offer)
├── CheckInDate, CheckOutDate
├── TotalPrice, NumberOfGuests
├── Status (BookingStatus: Pending, Confirmed, CancelledByHost, CancelledByGuest, Completed)
└── CreatedAt

**Soft Delete:** Booking używa statusów CancelledByHost/CancelledByGuest zamiast pola IsDeleted

Review
├── Id (PK)
├── BookingId (FK → Booking)
├── GuestId (FK → AspNetUsers)
├── OfferId (FK → Offer)
├── Rating, Content
└── CreatedAt

ReviewPhoto
├── Id (PK)
├── ReviewId (FK → Review)
└── Url

Conversation
├── Id (PK)
├── OfferId (FK → Offer, nullable)
└── ReviewId (FK → Review, nullable)

ConversationUser (automatyczna tabela łączącą - EF Core)
├── ConversationsId (FK → Conversation)
└── ParticipantsId (FK → AspNetUsers)

Message
├── Id (PK)
├── ConversationId (FK → Conversation)
├── SenderId (FK → AspNetUsers)
├── Content
├── SentAt
└── IsRead
```

## 🐳 Docker & Configuration

### Containerization & Configuration Flow
**Docker Compose → appsettings.json → Application**

1. **Docker Compose** (`docker-compose.override.yaml`) - Environment variables:
   ```yaml
   environment:
     - ConnectionStrings__DefaultConnection=Host=postgres;Database=bookplace;...
     - RabbitMQ__Hostname=rabbitmq
     - RabbitMQ__Username=guest  
     - RabbitMQ__Password=guest
     - JwtSettings__SecretKey=your-secret-key
     - JwtSettings__Issuer=BookPlace
     - JwtSettings__Audience=BookPlace
   ```

2. **appsettings.json** - Configuration structure:
   ```json
   {
     "ConnectionStrings": { "DefaultConnection": "..." },
     "RabbitMQ": { "Hostname": "...", "Username": "...", "Password": "..." },
     "JwtSettings": { "SecretKey": "...", "Issuer": "...", "Audience": "..." }
   }
   ```

3. **Application** - Auto-binding via:
   - `IConfiguration` injection
   - `services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"))`
   - `services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString))`

**Key principle**: Docker env vars override appsettings.json values automatically (.NET Core configuration precedence)

## 🔐 Authorization & JWT

### JWT Configuration
- **Access Token**: 15 min, Claims: sub, email, given_name, roles, jti, iat
- **Refresh Token**: 7 days, Claims: sub, jti, token_type=refresh
- **Algorithm**: HS256, **Service**: `Infrastructure/Services/JWT/JwtService.cs`

### Custom Authorization Policies (Resource-Based)
**Requirements (Application layer)**: Markers for "WHAT to check"
**Handlers (Infrastructure layer)**: Logic for "HOW to check"

#### Main Policies:
- **OfferOwnerPolicy**: `offer.HostId == currentUserId` (edit/delete offers)
- **OfferViewPolicy**: Public: `offer.Status == Active` OR Private: `offer.HostId == currentUserId` (view offers)
- **BookingHostPolicy**: `booking.Offer.HostId == currentUserId` (accept/reject bookings) 
- **BookingOwnerPolicy**: `booking.GuestId == currentUserId` (cancel own bookings)
- **BookingParticipantPolicy**: `booking.GuestId == currentUserId || booking.Offer.HostId == currentUserId` (access booking details)
- **ReviewOwnerPolicy**: `review.GuestId == currentUserId` (edit/delete reviews)
- **ReviewEligibilityPolicy**: `userId == resource.UserId` + complex booking completion verification (add reviews)
- **ConversationInitiatorPolicy**: `userId == resource.InitiatorId` + business rules (start conversations)
- **ConversationParticipantPolicy**: `conversation.Participants.Any(p => p.Id == currentUserId)` (access chat/messages)
- **MessageOwnerPolicy**: `message.SenderId == currentUserId` (edit/delete messages)
- **GuestOnlyPolicy**: `user.IsInRole("Guest") && !user.IsInRole("Host")` (role promotion - prevents Hosts from being promoted again)

### Policy Usage in Controllers:
```csharp
[Authorize(Policy = "OfferOwnerPolicy")]  // Resource-based
[Authorize(Roles = "Host")]               // Role-based
[Authorize(Policy = "GuestOnlyPolicy")]   // Role validation for promotion
```

### Authentication vs Authorization:
- **`[Authorize]`** = Authentication only - checks if user is logged in (`User.Identity.IsAuthenticated == true`)
- **`[Authorize(Policy = "PolicyName")]`** = Authentication + Authorization - checks permissions for specific resources
- **`[Authorize(Roles = "Role")]`** = Authentication + Role-based authorization

#### When to use each:
- **Basic `[Authorize]`**: Self-service endpoints (`/api/auth/me`, `/api/auth/logout`, `/api/auth/promote-to-host`)
- **Policy-based**: Resource ownership validation (`/api/offers/{id}` - only owner can edit)
- **Role-based**: Feature access control (`/api/offers` POST - only Hosts can create)

## 🧪 Zasady Testowania

### Co Testujemy (Priorytet WYSOKI)
- **Logika biznesowa** - wszystkie metody w warstwie Domain/Entities
- **Use Cases** - kluczowe funkcjonalności w Application/Features
- **Endpointy API** - główne kontrolery (szczególnie CRUD operations)
- **Walidacje** - reguły biznesowe i walidacje danych

### Co NIE Testujemy (Nie marnujemy czasu)
- ❌ Proste gettery/settery
- ❌ Automatyczne mapowania AutoMapper (chyba że custom logic)
- ❌ Entity Framework configurations
- ❌ Dependency Injection setup
- ❌ Proste CRUD repozytoria bez logiki
- ❌ DTOs bez logiki

### 🎯 Strategia Testów
1. **80/20 Rule** - 80% effort na Domain + Application, 20% na resztę
2. **Najpierw Happy Path** - potem edge cases
3. **Jeden test = jedna odpowiedzialność**
4. **Arrange-Act-Assert pattern**
5. **Descriptive test names** - `Method_Should_When`
---
*Ostatnia aktualizacja: 2024-10-24*
