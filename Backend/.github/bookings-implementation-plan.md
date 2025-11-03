# Plan Implementacji: Moduł Rezerwacji (Bookings)

## 🎯 Przegląd

Plan implementuje kompletny moduł rezerwacji zgodny z Clean Architecture i wzorcami CQRS/MediatR. Wszystkie endpointy używają autoryzacji opartej na zasobach oraz Unit of Work pattern.

---

## 📋 Lista Endpointów

1. **POST /api/bookings** - Tworzenie rezerwacji
2. **GET /api/bookings** - Lista rezerwacji z paginacją i filtrami
3. **GET /api/offers/{offerId}/busy-dates** - Zajęte daty dla oferty
4. **GET /api/bookings/{id}** - Szczegóły rezerwacji
5. **PATCH /api/bookings/{id}/cancel-by-host** - Anulowanie przez hosta
6. **PATCH /api/bookings/{id}/cancel-by-guest** - Anulowanie przez gościa

---

## 🏗️ Implementacja według warstw

### 1. POST /api/bookings (Tworzenie rezerwacji)

#### 📱 Application Layer
- **CreateBookingCommand.cs** - Zawiera `OfferId`, `CheckInDate`, `CheckOutDate`, `NumberOfGuests`, walidację DTO oraz `internal set GuestId`
- **CreateBookingCommandHandler.cs** - Logika biznesowa:
  - Pobranie oferty z `_unitOfWork.Offers.GetByIdAsync()`
  - Walidacja reguł (MaxGuests, Status Active)
  - Sprawdzenie dostępności dat (`IsDateRangeAvailableAsync`)
  - Obliczenie TotalPrice i utworzenie Booking
  - Publikacja `BookingCreatedEvent` (MassTransit)
  - Zapis przez `_unitOfWork.SaveChangesAsync()`

#### 🎮 API Layer
- **BookingsController** - `[Authorize]` + pobieranie `userId` z Claims
- **CreateBooking([FromBody] CreateBookingCommand command)** 
- Zwraca `CreatedAtAction` (Status 201)

---

### 2. GET /api/bookings (Lista z paginacją)

#### 📱 Application Layer
- **GetPaginatedBookingsQuery.cs** - `IRequest<PageResult<BookingDto>>` z parametrami:
  - `PageNumber`, `PageSize` (mapowane z [FromQuery])
  - `role`, `status`, `offerId`, `dateFrom`, `dateTo` 
  - `internal set UserId`
- **GetPaginatedBookingsQueryHandler.cs** - Deleguje do repository, mapuje wyniki

#### 🗄️ Infrastructure Layer
- **IBookingRepository.GetPaginatedBookingsAsync()** - Dynamiczne filtrowanie:
  - `role == "guest"` → filtruj po `GuestId`
  - `role == "host"` → filtruj po `Offer.HostId`
  - Pozostałe filtry (status, offerId, daty)
  - Użycie `ToPageResultAsync()` extension method

#### 🎮 API Layer
- **GetPaginatedBookings([FromQuery] GetPaginatedBookingsQuery query)**
- `[Authorize]` + ustawienie `query.UserId` z Claims

---

### 3. GET /api/offers/{offerId}/busy-dates (Zajęte daty)

#### 📱 Application Layer
- **GetOfferBusyDatesQuery.cs** - `OfferId`, `Month`, `Year` → `IRequest<List<string>>`
- **GetOfferBusyDatesQueryHandler.cs** - Deleguje do `_unitOfWork.Bookings.GetBusyDatesAsync()`

#### 🗄️ Infrastructure Layer
- **IBookingRepository.GetBusyDatesAsync()** - Optymalizowane zapytanie:
  - Filtrowanie po `BookingStatus.Confirmed`
  - `SelectMany` + `Select` dla wydajności
  - Generowanie listy dni między CheckIn/CheckOut
  - Format `"YYYY-MM-DD"`

#### 🎮 API Layer
- **OffersController.GetBusyDates()** - endpoint w kontekście oferty
- Parametry: `[FromRoute] int offerId`, `[FromQuery] int? month, year`

---

### 4. GET /api/bookings/{id} (Szczegóły z autoryzacją)

#### 📱 Application Layer
- **GetBookingByIdQuery.cs** - `int Id` → `IRequest<BookingDto>`
- **GetBookingByIdQueryHandler.cs** - **Resource-Based Authorization**:
  - Pobranie booking z `GetBookingWithOfferAsync()`
  - Sprawdzenie `NotFoundException`
  - Autoryzacja: `_authorizationService.AuthorizeAsync(user, booking, "BookingParticipantPolicy")`
  - Mapowanie na DTO

#### 🔐 Infrastructure Layer (Authorization)
- **BookingParticipantPolicy** + **BookingParticipantAuthorizationHandler**
- Logika: `booking.GuestId == userId || booking.Offer.HostId == userId`

#### 🎮 API Layer
- **GetBookingById([FromRoute] int id)** - Autoryzacja zarządzana przez Handler

---

### 5. PATCH /api/bookings/{id}/cancel-by-host (Anulowanie przez hosta)

#### 📱 Application Layer
- **CancelBookingByHostCommand.cs** - `int BookingId`
- **CancelBookingByHostCommandHandler.cs** - **Resource-Based Authorization**:
  - Pobranie booking z ofertą
  - Autoryzacja: `"BookingHostPolicy"` (sprawdza `booking.Offer.HostId == userId`)
  - Walidacja biznesowa (czy można anulować)
  - Ustawienie `BookingStatus.CancelledByHost`
  - Zapis zmian

#### 🔐 Infrastructure Layer (Authorization)
- **BookingHostPolicy** + Handler sprawdzający `booking.Offer.HostId == userId`

---

### 6. PATCH /api/bookings/{id}/cancel-by-guest (Anulowanie przez gościa)

#### 📱 Application Layer
- **CancelBookingByGuestCommand.cs** - `int BookingId`
- **CancelBookingByGuestCommandHandler.cs** - Analogiczne do hosta:
  - Autoryzacja: `"BookingOwnerPolicy"` (sprawdza `booking.GuestId == userId`)
  - Logika anulacji (dodatkowe reguły biznesowe)
  - Status: `BookingStatus.CancelledByGuest`

#### 🔐 Infrastructure Layer (Authorization)
- **BookingOwnerPolicy** + Handler sprawdzający `booking.GuestId == userId`

---

## 🔧 Wymagane uzupełnienia infrastruktury

### IUnitOfWork
```csharp
// Dodaj do IUnitOfWork:
IBookingRepository Bookings { get; }
```

### IBookingRepository
```csharp
public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Booking?> GetBookingWithOfferAsync(int id, CancellationToken ct = default);
    Task<PageResult<Booking>> GetPaginatedBookingsAsync(GetPaginatedBookingsQuery query, CancellationToken ct);
    Task<List<string>> GetBusyDatesAsync(int offerId, int? month, int? year, CancellationToken ct);
    Task<bool> IsDateRangeAvailableAsync(int offerId, DateTime checkIn, DateTime checkOut, CancellationToken ct);
    Task AddAsync(Booking booking, CancellationToken ct = default);
}
```

### BookingDto
```csharp
public class BookingDto
{
    public int Id { get; set; }
    public string GuestId { get; set; }
    public int OfferId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalPrice { get; set; }
    public int NumberOfGuests { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Opcjonalne - szczegóły oferty dla listy
    public string? OfferTitle { get; set; }
    public string? OfferCity { get; set; }
    public string? OfferCoverPhotoUrl { get; set; }
}
```

### Authorization Policies
```csharp
// W DependencyInjection.cs
services.AddAuthorizationPolicies(builder =>
{
    builder.AddPolicy("BookingParticipantPolicy", policy => 
        policy.Requirements.Add(new BookingParticipantRequirement()));
    builder.AddPolicy("BookingHostPolicy", policy => 
        policy.Requirements.Add(new BookingHostRequirement()));
    builder.AddPolicy("BookingOwnerPolicy", policy => 
        policy.Requirements.Add(new BookingOwnerRequirement()));
});
```

---

## ✅ Zgodność z Clean Architecture

- **✅ CQRS/MediatR** - Wszystkie use cases jako Command/Query + Handler
- **✅ Unit of Work** - Jeden punkt dostępu do repozytoriów  
- **✅ Resource-Based Authorization** - Sprawdzanie uprawnień na poziomie zasobu
- **✅ Exception Handling** - GlobalExceptionHandlingMiddleware obsłuży wyjątki
- **✅ Dedykowane Wyjątki** - Semantyczne wyjątki domenowe z kontekstem biznesowym
- **✅ Walidacja DTO** - Atrybuty walidacji w Command/Query
- **✅ Extension Methods** - Używanie `ToPageResultAsync()` dla paginacji
- **✅ Async/Await** - Wszystkie operacje IO asynchroniczne
- **✅ AutoMapper** - Mapowanie Domain → DTO w Handlerach
- **✅ MassTransit** - Publikacja zdarzeń biznesowych

---

