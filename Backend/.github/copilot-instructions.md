﻿Jasne, oto kompletny plik MD w jednym bloku, gotowy do skopiowania.

# BookPlace Backend - Skondensowane Instrukcje

## 🚨 ZASADY FUNDAMENTALNE - BEZWZGLĘDNIE PRZESTRZEGAJ

### ✅ ZAWSZE:
- **ZAWSZE Clean Architecture**: Logika biznesowa TYLKO w `Application` (Handlers) i `Domain` (Entities).
- **ZAWSZE CQRS/MediatR**: Wszystkie przypadki użycia (use cases) implementuj jako `IRequest` i `IRequestHandler` w `Application/Features`.
- **ZAWSZE Unit of Work**: Wstrzykuj `IUnitOfWork` do Handlerów zamiast pojedynczych repozytoriów. Używaj `await _unitOfWork.SaveChangesAsync()` na końcu operacji zapisujących.
- **ZAWSZE Authorization Policies**: Używaj autoryzacji opartej na zasobach (`IAuthorizationService` lub Policy).
- **ZAWSZE XML Summary**: Każda publiczna metoda/klasa MUSI mieć dokumentację `/// <summary>`.
- **ZAWSZE Walidacja w DTO**: Używaj atrybutów `[Required]`, `[MinLength]` itd. bezpośrednio w plikach DTO w warstwie `Application`.
- **ZAWSZE Middleware**: Globalna obsługa błędów przez dedykowany middleware.
- **ZAWSZE Dependency Injection**: Rejestruj zależności w plikach `DependencyInjection.cs` lub `Program.cs`.
- **ZAWSZE Async/Await**: Wszystkie operacje IO (baza danych, pliki) muszą być asynchroniczne.
- **ZAWSZE JWT Claims**: Używaj `ClaimTypes.NameIdentifier` dla `userId`.
- **ZAWSZE Exceptions**: Rzucaj wyjątki domenowe (`UnauthorizedAccessException`, `InvalidOperationException`, `NotFoundException`) zamiast zwracać `null`.
- **ZAWSZE Query Params dla paginacji**: `[FromQuery]` automatycznie mapuje `pageNumber`, `pageSize` na Query object.
- **ZAWSZE PageResult<T>**: Używaj przygotowanej klasy z `Items`, `TotalPages`, `TotalItemsCount`, `PageNumber`, `PageSize`.
- **ZAWSZE Extension Methods**: Używaj `ToPageResultAsync()` dla paginacji - gotowy mechanizm w Infrastructure.

### ❌ NIGDY:
- **NIGDY Try-catch w kontrolerach**: Globalny middleware obsługuje wszystkie wyjątki.
- **NIGDY Logika biznesowa w kontrolerach**: Kontroler deleguje pracę **TYLKO** do `IMediator`.
- **NIGDY Duże serwisy (God Services)**: **NIE TWORZYJ** interfejsów typu `I{Nazwa}Service`. Używaj małych, skupionych Handlerów MediatR.
- **NIGDY Direct DbContext w kontrolerach**: Kontrolery nie wiedzą o DbContext.
- **NIGDY Pojedyncze repozytoria w Handlerach**: **NIE WSTRZYKUJ** `IOfferRepository`, `IActiveTokenRepository` osobno. Używaj `IUnitOfWork`.
- **NIGDY Magic strings**: Używaj `const`, `enums` lub `nameof()`.
- **NIGDY Sprawdzanie `userId` w kontrolerach**: `userId` jest przekazywany do Commanda/Query.
- **NIGDY Hardcodowane connection stringi**: Używaj `IConfiguration` i `appsettings.json`.
- **NIGDY Synchroniczne operacje IO**.
- **NIGDY Custom paginacja**: **NIE WYMYŚLAJ** własnych mechanizmów - używaj przygotowanych Extension Methods.
- **NIGDY Paginacja w kontrolerach**: Logika paginacji TYLKO w Repository przez `ToPageResultAsync()`.
- **NIGDY Bez Query parametrów**: Paginacja ZAWSZE przez `[FromQuery]` mapping na Query object.

### 🎯 TYLKO:
- **TYLKO Controllers**: Routing HTTP, pobieranie `userId` z Claimów, wysyłanie Command/Query do `IMediator` i zwracanie `ActionResult`.
- **TYLKO Application (Features & DTOs)**: Definicje `Command`/`Query`, logika biznesowa w `Handlerach`, walidacja w `DTOs` (atrybuty).
- **TYLKO Domain Entities**: Czyste reguły biznesowe, walidacja stanu, `ValueObjects`.
- **TYLKO Infrastructure**: Implementacje interfejsów (np. `IRepository`, `IJwtService`), dostęp do bazy danych (DbContext).
- **TYLKO Unit of Work w Handlerach**: Wstrzykuj `IUnitOfWork` do konstruktora, używaj `_unitOfWork.{Repository}` dla dostępu do danych, `await _unitOfWork.SaveChangesAsync()` na końcu.
- **TYLKO Handlers (Autoryzacja)**: Logika dla `IAuthorizationRequirement` sprawdzająca uprawnienia do zasobu.
- **TYLKO Requirements (Autoryzacja)**: Puste "znaczniki" `IAuthorizationRequirement` w warstwie `Application`.
- **TYLKO Gotowe Extension Methods**: `ToPageResultAsync()` dla paginacji - nie wymyślaj własnych.
- **TYLKO ORM optimizations**: `AsNoTracking()`, selektywne `Include()` - pozwól ORM zoptymalizować zapytania.
- **TYLKO Query objects**: Parametry paginacji w dedykowanych `Query` klasach z walidacją atrybutami.

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

---

## 🔄 Unit of Work Pattern

### 🚫 **ANTY-WZORCE**:
```csharp
// ❌ ŹLEŹLE - osobne repozytoria
public Handler(IOfferRepository offers, IActiveTokenRepository tokens) { }

// ✅ DOBRZE - Unit of Work
public Handler(IUnitOfWork unitOfWork) { }
```


### 🔧 **Transakcje** (dla złożonych operacji):
```csharp
await _unitOfWork.BeginTransactionAsync();
try
{
    // Wiele operacji...
    await _unitOfWork.SaveChangesAsync();
    await _unitOfWork.CommitTransactionAsync();
}
catch
{
    await _unitOfWork.RollbackTransactionAsync();
    throw;
}
```

---

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

## 🔄 Mapowanie i AutoMapper

### **Struktura Mapowań:**
- **`Application/Mappings/`**: Folder główny dla wszystkich profili mapowania.
- **`Application/Mappings/{Feature}/`**: Dedykowany podfolder dla każdego feature (np. `Offers/`, `Auth/`, `Bookings/`).
- **Konwencja nazewnictwa**: `{Feature}MappingProfile.cs` (np. `OfferMappingProfile.cs`, `AuthMappingProfile.cs`).

### **Zasady Mapowania:**

#### ✅ **ZAWSZE** (AutoMapper):
- **ZAWSZE Profile na feature**: Jeden `MappingProfile` na jeden feature/domenę biznesową.
- **ZAWSZE Explicit mapping**: Definiuj mapowania jawnie w `CreateMap<Source, Destination>()`.
- **ZAWSZE Domain → DTO**: Mapowanie FROM Domain Entities TO DTOs (nigdy odwrotnie w read operations).
- **ZAWSZE w Handlerach**: Mapowanie TYLKO w `Application` Layer (Handlers), nigdy w kontrolerach.
- **ZAWSZE DI Registration**: AutoMapper rejestrowany automatycznie - skanuje wszystkie Profile w Assembly.

#### ❌ **NIGDY** (AutoMapper):
- **NIGDY Mapowanie w kontrolerach**: Kontrolery nie znają Domain Entities.
- **NIGDY Mapowanie w Infrastructure**: Repository zwraca Domain Entities, nie DTOs.
- **NIGDY Implicit mapping**: Nie polegaj na automatycznym mapowaniu przez nazwy właściwości.
- **NIGDY Jeden duży Profile**: **NIE TWORZYJ** `GlobalMappingProfile` - dziel na feature.

#### 🎯 **TYLKO** (AutoMapper):
- **TYLKO Handlers mapują**: `var dto = _mapper.Map<TargetDto>(domainEntity)` w `IRequestHandler`.
- **TYLKO Custom resolvers**: Używaj `MapFrom()` dla złożonych transformacji.
- **TYLKO Profile inheritance**: `Profile` dziedziczy z AutoMapper, nie tworz własnych abstrakcji.

### **Przykład Struktury:**
```
Application/
├── Mappings/
│   ├── Auth/
│   │   └── AuthMappingProfile.cs
│   ├── Offers/
│   │   └── OfferMappingProfile.cs
│   ├── Bookings/
│   │   └── BookingMappingProfile.cs
│   └── Reviews/
│       └── ReviewMappingProfile.cs
```

### **Wzorzec Profile:**
```csharp
// Application/Mappings/Offers/OfferMappingProfile.cs
public class OfferMappingProfile : Profile
{
    public OfferMappingProfile()
    {
        CreateMap<Offer, OfferDto>()
            .ForMember(dest => dest.OfferTypeName, 
                      opt => opt.MapFrom(src => src.OfferType.Name));
                      
        CreateMap<CreateOfferCommand, Offer>();
    }
}
```

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
- **System Ulubionych**: Użytkownicy mogą dodawać oferty do ulubionych (lista ID przechowywana jako JSON w encji User).
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

## 🗄️ Schemat Bazy Danych

### 👤 **Identity & Użytkownicy**
- **`User`** (extends `IdentityUser`): `Name`, `Surname`, `Phone`, `ProfilePictureUrl`
- **`User`** (extends `IdentityUser`): `Name`, `Surname`, `Phone`, `ProfilePictureUrl`, `FavoriteOfferIds` (List<int> jako JSON)

### 🏠 **Oferty i Noclegi**
- **`OfferType`** (Słownik): `Id`, `Name` (np. "Apartament", "Dom", "Pokój")
- **`Amenity`** (Słownik): `Id`, `Name` (np. "WiFi", "Parking", "Basen")
- **`Offer`** (Główna encja):
  - **Podstawowe**: `Id`, `HostId`, `OfferTypeId`, `Title`, `Description`, `PricePerNight`
  - **Szczegóły**: `MaxGuests`, `Bedrooms`, `Bathrooms`
  - **Status**: `Status` (`OfferStatus.Active|Inactive|Suspended`), `IsArchive` (soft delete)
  - **Adres**: `AddressStreet`, `AddressCity`, `AddressZipCode`, `AddressCountry`, `AddressLatitude`, `AddressLongitude`
  - **Relacje**: M-N z `Amenity`, 1-N z `OfferPhoto`, `Booking`, `Review`, `Conversation`
- **`OfferPhoto`**: `Id`, `OfferId`, `OriginalUrl`, `MediumUrl`, `ThumbnailUrl`, `IsCover`, `SortOrder`

### 📅 **Rezerwacje**
- **`Booking`**: 
  - **Podstawowe**: `Id`, `GuestId`, `OfferId`, `CheckInDate`, `CheckOutDate`, `TotalPrice`, `NumberOfGuests`
  - **Status**: `Status` (`BookingStatus.Pending|Confirmed|CancelledByHost|CancelledByGuest|Completed`)
  - **Metadata**: `CreatedAt`
  - **Relacje**: 1-1 z `Review` (opcjonalna)

### ⭐ **System Opinii**
- **`Review`**: `Id`, `BookingId`, `GuestId`, `OfferId`, `Rating`, `Content`, `CreatedAt`
- **`ReviewPhoto`**: `Id`, `ReviewId`, `OriginalUrl`, `ThumbnailUrl`

### 💬 **Komunikacja (Chat)**
- **`Conversation`**: `Id`, `OfferId?`, `ReviewId?` (kontekst rozmowy)
- **`Message`**: `Id`, `ConversationId`, `SenderId`, `Content`, `SentAt`, `IsRead`
- **Relacje**: M-N między `User` ↔ `Conversation` (uczestnictwo w rozmowach)

### 🔐 **Zarządzanie Tokenami (Whitelist)**
- **`ActiveToken`**: `Id`, `Jti`, `UserId`, `TokenType` (`TokenType.Access|Refresh`), `CreatedAt`, `ExpiresAt`

### 📊 **Enumy **
- **`OfferStatus`**: `Active`, `Inactive`, `Suspended`
- **`BookingStatus`**: `Pending`, `Confirmed`, `CancelledByHost`, `CancelledByGuest`, `Completed`
- **`TokenType`**: `Access`, `Refresh`
-----

## 🐳 Docker & Configuration

- **Zasada**: Zmienne środowiskowe w Docker Compose (`docker-compose.yaml`) **nadpisują** wartości w `appsettings.json`.
- **Struktura**: Używaj zagnieżdżonej konfiguracji (np. `JwtSettings:SecretKey`) mapowanej na zmienne środowiskowe (`JwtSettings__SecretKey`).

-----

## 🔐 Authorization & JWT

- **Access Token**: 15 min (zawiera `userId` i `roles`).

- **Refresh Token**: 7 dni (zawiera tylko `userId` i `token_type`).

## 🔐 Authorization & JWT

- **Access Token**: 15 min (zawiera `userId` i `roles`).
- **Refresh Token**: 7 dni (zawiera tylko `userId` i `token_type`).
- **Token Whitelist**: System używa **whitelist** - tylko tokeny w tabeli `ActiveTokens` są ważne.

### 🗄️ Encje Tokenów (UPDATED 2025-10-28)

- **`ActiveToken`**: Encja reprezentująca aktywne (ważne) tokeny JWT w systemie.
  - `Jti` (string): Unikalny identyfikator tokenu z JWT claim
  - `UserId` (string): ID właściciela tokenu  
  - `TokenType` (enum): `TokenType.Access` lub `TokenType.Refresh`
  - `ExpiresAt` (DateTime): Data wygaśnięcia tokenu
  - `CreatedAt` (DateTime): Data utworzenia

- **Whitelist Logic**: Token jest ważny TYLKO jeśli:
  1. Jest poprawnie podpisany (weryfikacja JWT)
  2. Istnieje w tabeli `ActiveTokens` 
  3. Nie wygasł (`ExpiresAt > DateTime.UtcNow`)

- **Repository**: `IActiveTokenRepository` zarządza operacjami CRUD na `ActiveTokens`.

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

