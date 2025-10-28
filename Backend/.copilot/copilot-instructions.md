Jasne, oto kompletny plik MD w jednym bloku, gotowy do skopiowania.

# BookPlace Backend - Skondensowane Instrukcje

## 🚨 ZASADY FUNDAMENTALNE - BEZWZGLĘDNIE PRZESTRZEGAJ

### ✅ ZAWSZE:
- **ZAWSZE Clean Architecture**: Logika biznesowa TYLKO w `Application` (Handlers) i `Domain` (Entities).
- **ZAWSZE CQRS/MediatR**: Wszystkie przypadki użycia (use cases) implementuj jako `IRequest` i `IRequestHandler` w `Application/Features`.
- **ZAWSZE Authorization Policies**: Używaj autoryzacji opartej na zasobach (`IAuthorizationService` lub Policy).
- **ZAWSZE XML Summary**: Każda publiczna metoda/klasa MUSI mieć dokumentację `/// <summary>`.
- **ZAWSZE Walidacja w DTO**: Używaj atrybutów `[Required]`, `[MinLength]` itd. bezpośrednio w plikach DTO w warstwie `Application`.
- **ZAWSZE Middleware**: Globalna obsługa błędów przez dedykowany middleware.
- **ZAWSZE Dependency Injection**: Rejestruj zależności w plikach `DependencyInjection.cs` lub `Program.cs`.
- **ZAWSZE Async/Await**: Wszystkie operacje IO (baza danych, pliki) muszą być asynchroniczne.
- **ZAWSZE JWT Claims**: Używaj `ClaimTypes.NameIdentifier` dla `userId`.
- **ZAWSZE Exceptions**: Rzucaj wyjątki domenowe (`UnauthorizedAccessException`, `InvalidOperationException`, `NotFoundException`) zamiast zwracać `null`.

### ❌ NIGDY:
- **NIGDY Try-catch w kontrolerach**: Globalny middleware obsługuje wszystkie wyjątki.
- **NIGDY Logika biznesowa w kontrolerach**: Kontroler deleguje pracę **TYLKO** do `IMediator`.
- **NIGDY Duże serwisy (God Services)**: **NIE TWORZYJ** interfejsów typu `I{Nazwa}Service`. Używaj małych, skupionych Handlerów MediatR.
- **NIGDY Direct DbContext w kontrolerach**: Kontrolery nie wiedzą o DbContext.
- **NIGDY Magic strings**: Używaj `const`, `enums` lub `nameof()`.
- **NIGDY Sprawdzanie `userId` w kontrolerach**: `userId` jest przekazywany do Commanda/Query.
- **NIGDY Hardcodowane connection stringi**: Używaj `IConfiguration` i `appsettings.json`.
- **NIGDY Synchroniczne operacje IO**.

### 🎯 TYLKO:
- **TYLKO Controllers**: Routing HTTP, pobieranie `userId` z Claimów, wysyłanie Command/Query do `IMediator` i zwracanie `ActionResult`.
- **TYLKO Application (Features & DTOs)**: Definicje `Command`/`Query`, logika biznesowa w `Handlerach`, walidacja w `DTOs` (atrybuty).
- **TYLKO Domain Entities**: Czyste reguły biznesowe, walidacja stanu, `ValueObjects`.
- **TYLKO Infrastructure**: Implementacje interfejsów (np. `IRepository`, `IJwtService`), dostęp do bazy danych (DbContext).
- **TYLKO Handlers (Autoryzacja)**: Logika dla `IAuthorizationRequirement` sprawdzająca uprawnienia do zasobu.
- **TYLKO Requirements (Autoryzacja)**: Puste "znaczniki" `IAuthorizationRequirement` w warstwie `Application`.

---

## 🏗️ Wzorce i Dobre Praktyki Clean Architecture

### Schemat Zależności (Dependency Flow):

Api → Application → Domain
↑
Infrastructure

- **Api** zależy od `Application`.
- **Application** zależy od `Domain`. Definiuje interfejsy (np. `IJwtService`, `IRepository`).
- **Infrastructure** zależy od `Application` i `Domain` (implementuje interfejsy).
- **Domain** **NIE ZALEŻY OD NICZEGO**.

### Odpowiedzialność Warstw (Wzorzec CQRS/MediatR):

#### 🎮 **API Layer** (Presentation):
- Wstrzykuje **TYLKO `IMediator`** (oraz opcjonalnie `IAuthorizationService`).
- Pobiera dane z `Request` HTTP (automatycznie mapowane na DTO) i `User.Claims`.
- Automatycznie waliduje DTO dzięki `[ApiController]`.
- Tworzy i wysyła `Command` lub `Query` do `IMediator`.
- Zwraca `ActionResult` (np. `Ok()`, `NotFound()`, `Forbid()`).

#### 🧠 **Application Layer** (Use Cases / Features):
- Definiuje `Command` (zapis) i `Query` (odczyt) jako implementacje `IRequest`.
- Definiuje `DTOs` z atrybutami walidacji (`[Required]`, `[EmailAddress]`, itd.).
- Implementuje logikę biznesową i orkiestrację w dedykowanych `Handlerach` (`IRequestHandler`).
- Definiuje interfejsy dla `Infrastructure` (np. `IRepository`, `IJwtService`).

#### 🏛️ **Domain Layer** (Core Business):
- Zawiera `Entities` (Encje) z metodami chroniącymi stan (np. `Offer.Archive()`).
- Zawiera `ValueObjects` (Obiekty Wartości), `Enums` i wyjątki domenowe.
- Jest całkowicie odizolowana od technologii.

#### 🔧 **Infrastructure Layer** (Technical Details):
- Implementuje interfejsy z `Application` (np. `OfferRepository : IOfferRepository`).
- Zawiera `DbContext` Entity Framework i konfiguracje encji.
- Implementuje dostęp do zewnętrznych API, systemu plików, brokera wiadomości (MassTransit) i `IJwtService`.
- Zawiera Handlery dla `IAuthorizationRequirement`.

---

## 🔐 Architektura Autoryzacji (Resource-Based)

1.  **Requirements (Application Layer)**: Definiuje **CO** sprawdzamy (pusty znacznik, np. `OfferOwnerRequirement`).
2.  **Handlers (Infrastructure Layer)**: Implementuje **JAK** sprawdzamy (np. `OfferOwnerAuthorizationHandler` sprawdzający `offer.HostId == userId`).
3.  **Użycie (API Layer)**:
    - **Metoda A (Atrybut)**: Dla prostych reguł (np. role) `[Authorize(Roles = "Host")]`.
    - **Metoda B (Serwis)**: Dla reguł opartych na zasobach (zalecane): kontroler pobiera zasób, a następnie ręcznie sprawdza uprawnienia używając `await _authorizationService.AuthorizeAsync(User, zasob, "PolicyName")`.

---

## 🚦 Obsługa Wyjątków i Walidacja

- **Globalny Middleware** (`GlobalExceptionHandlingMiddleware`) jest **jedynym** miejscem, które łapie wyjątki (`try-catch`).
- Middleware mapuje wyjątki na kody HTTP:
  - `InvalidOperationException` $\to$ **400 Bad Request**
  - `UnauthorizedAccessException` $\to$ **401 Unauthorized** / **403 Forbidden**
  - `NotFoundException` $\to$ **404 Not Found**
  - Inne wyjątki $\to$ **500 Internal Server Error**
- **Walidacja** odbywa się **automatycznie** w `Api` Layer dzięki atrybutom `[Required]`, `[MinLength]` itd. na `DTOs` w `Application`.
- Błędy walidacji są automatycznie łapane przez ASP.NET Core i zwracane jako **400 Bad Request** (nie trzeba ich obsługiwać w middleware).

---

## 📏 Standardy Jakości Kodu

- **Dokumentacja**: ZAWSZE `/// <summary>`. Opcjonalnie `<param>`, `<returns>`, `<exception>`. Opisuj intencję biznesową.
- **Walidacja**: ZAWSZE `ErrorMessage = "..."` dla każdej reguły atrybutu walidacji.
- **Format Błędów (JSON)**:
  ```json
  {
    "message": "User with this email already exists",
    "statusCode": 400,
    "timestamp": "2024-10-25T10:30:00Z"
  }

- **Konwencje Nazewnictwa**:
    - **Controllers**: `{Zasób}Controller` (np. `OffersController`)
    - **Commands**: `{Akcja}{Zasób}Command` (np. `CreateOfferCommand`)
    - **Queries**: `Get{Zasób}Query` (np. `GetOfferByIdQuery`)
    - **Handlers**: `{NazwaCommanda/Query}Handler` (np. `CreateOfferCommandHandler`)
    - **Policies**: `{Cel}Policy` (np. `OfferOwnerPolicy`)
- **Kody Statusu HTTP**:
    - **200 OK**: Sukces `GET`, `PUT`, `PATCH`.
    - **201 Created**: Sukces `POST` (zwraca zasób lub link).
    - **204 No Content**: Sukces `DELETE`.
    - **400 Bad Request**: Błędy walidacji, złamane reguły biznesowe (`InvalidOperationException`).
    - **401 Unauthorized**: Błąd autentykacji (brak tokenu, zły token).
    - **403 Forbidden**: Błąd autoryzacji (brak uprawnień - błąd `Policy`).
    - **404 Not Found**: Zasób nie istnieje (`NotFoundException`).
    - **500 Internal Server Error**: Nieobsłużone wyjątki.

-----

## Opis Projektu

BookPlace Backend to aplikacja .NET 8.0 (Clean Architecture) dla platformy rezerwacji noclegów.

### 🏠 Główne Funkcjonalności

- **Rezerwacje i Oferty**: Zarządzanie dostępnością, lokalizacją, udogodnieniami, typami i zdjęciami ofert.
- **System Opinii**: Opinie (ze zdjęciami) powiązane z zakończoną rezerwacją.
- **Soft Delete**: Używanie statusów (`CancelledBy...`, `IsArchive`) zamiast fizycznego usuwania.
- **Komunikacja (Chat)**: Historia wiadomości (WebSocket) powiązana z ofertą lub opinią.

### 📸 Zarządzanie Zdjęciami

- Pliki przechowywane lokalnie. Automatyczne generowanie miniatur i optymalizacja.

### 🚌 MassTransit & Message Broker

- Użycie RabbitMQ do obsługi zdarzeń asynchronicznych (np. wysyłka powiadomień) z polityką ponawiania (retry).

-----

## Architektura

### 📁 Struktura Folderów

```
Backend/
├── src/
│   ├── Api/                      # (Presentation) Kontrolery, Middleware, Program.cs
│   ├── Application/              # (Use Cases) Features (CQRS), DTOs (z walidacją), Interfejsy
│   ├── Domain/                   # (Core) Encje, ValueObjects, Wyjątki domenowe
│   └── Infrastructure/           # (Technical) DbContext, Repozytoria, Serwisy (JWT), Handlery (Auth)
├── tests/
│   ├── Application.Tests/
│   ├── Domain.Tests/
│   └── ...
├── docker-compose.yaml
└── Backend.sln
```

### Technologie:

- .NET 8.0, ASP.NET Core, EF Core 8
- PostgreSQL, RabbitMQ (MassTransit)
- ASP.NET Identity, JWT, Docker

-----

## Schemat Bazy Danych

- **Identity**: `AspNetUsers` (rozszerzone o `Name`, `ProfilePictureUrl`), `AspNetRoles`, `AspNetUserRoles`.
- **Oferty**:
    - `OfferType` (Słownik)
    - `Amenity` (Słownik)
    - `Offer` (Główna encja: `HostId`, `OfferTypeId`, `PricePerNight`, `Status`, `IsArchive`, Adres jako `ValueObject`)
    - `OfferPhoto` (Relacja 1-do-N z `Offer`)
    - `OfferAmenity` (Relacja M-N)
- **Rezerwacje**:
    - `Booking` (Główna encja: `GuestId`, `OfferId`, `CheckInDate`, `CheckOutDate`, `TotalPrice`, `Status`)
- **Opinie**:
    - `Review` (Główna encja: `BookingId`, `GuestId`, `OfferId`, `Rating`)
    - `ReviewPhoto` (Relacja 1-do-N z `Review`)
- **Chat**:
    - `Conversation` (Kontekst: `OfferId?`, `ReviewId?`)
    - `Message` (Wiadomość: `ConversationId`, `SenderId`, `Content`)
    - `ConversationParticipant` (Relacja M-N Użytkownicy $\leftrightarrow$ Konwersacje)

-----

## 🐳 Docker & Configuration

- **Zasada**: Zmienne środowiskowe w Docker Compose (`docker-compose.yaml`) **nadpisują** wartości w `appsettings.json`.
- **Struktura**: Używaj zagnieżdżonej konfiguracji (np. `JwtSettings:SecretKey`) mapowanej na zmienne środowiskowe (`JwtSettings__SecretKey`).

-----

## 🔐 Authorization & JWT

- **Access Token**: 15 min (zawiera `userId` i `roles`).

- **Refresh Token**: 7 dni (zawiera tylko `userId` i `token_type`).

- **Polityki (Policies)**:

    - `OfferOwnerPolicy`: Czy `offer.HostId == currentUserId`
    - `OfferViewPolicy`: Czy `offer.Status == Active` LUB `offer.HostId == currentUserId`
    - `BookingHostPolicy`: Czy `booking.Offer.HostId == currentUserId`
    - `BookingOwnerPolicy`: Czy `booking.GuestId == currentUserId`
    - `BookingParticipantPolicy`: Czy (Guest LUB Host)
    - `ReviewOwnerPolicy`: Czy `review.GuestId == currentUserId`
    - `ReviewEligibilityPolicy`: Czy użytkownik zakończył rezerwację i jeszcze nie dodał opinii
    - `ConversationParticipantPolicy`: Czy użytkownik jest na liście uczestników konwersacji
    - `GuestOnlyPolicy`: Czy `user.IsInRole("Guest") && !user.IsInRole("Host")`

- **Rozróżnienie**:

    - **`[Authorize]`**: Tylko autentykacja (czy zalogowany).
    - **`[Authorize(Roles = "Host")]`**: Autentykacja + Rola.
    - **`[Authorize(Policy = "...")]` / `IAuthorizationService`**: Autentykacja + Autoryzacja (sprawdzenie zasobu).

-----

## 🧪 Zasady Testowania

### Co Testujemy (Priorytet WYSOKI)

- **Logika biznesowa** (Metody w `Domain/Entities`).
- **Use Cases** (`Handler`y w `Application/Features`).
- **Polityki autoryzacji** (`Handler`y w `Infrastructure/Authorization`).

### Czego NIE Testujemy (Niski priorytet)

- ❌ Proste CRUD-y w kontrolerach.
- ❌ Automatyczne mapowania (AutoMapper).
- ❌ Konfiguracje EF Core i `DependencyInjection`.
- ❌ Proste DTOs bez logiki (poza walidacją).

### 🎯 Strategia Testów

1.  **Reguła 80/20**: 80% wysiłku na `Domain` + `Application`.
2.  **Arrange-Act-Assert**: Zawsze stosuj ten wzorzec.
3.  **Nazewnictwo**: Używaj formatu `Metoda_Powinna_Gdy` (np. `Archive_Should_ThrowException_WhenOfferIsNotActive`).

-----
*Ostatnia aktualizacja: 2025-10-25*

