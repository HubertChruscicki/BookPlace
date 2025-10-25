﻿﻿﻿# BookPlace Backend - Copilot Instructions

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
