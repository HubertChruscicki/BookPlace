# 💬 BookPlace Chat System - Plan Implementacji SignalR

## 🚨 ZASADY FUNDAMENTALNE

### ✅ ZAWSZE:
- **ZAWSZE Odwrócona paginacja**: Najnowsze wiadomości na końcu, paginacja od ostatniej strony
- **ZAWSZE SignalR Groups**: Użytkownicy dołączają do grup konwersacji (`conversation-{id}`)
- **ZAWSZE Authorization w Hub**: Sprawdzaj uprawnienia przed dołączeniem do grupy
- **ZAWSZE Real-time + REST**: SignalR dla real-time, REST API dla historii i paginacji
- **ZAWSZE Message ordering**: `ORDER BY SentAt ASC` dla właściwej kolejności wiadomości
- **ZAWSZE Connection mapping**: Mapowanie `userId` → `connectionId` w pamięci
- **ZAWSZE Cleanup**: Usuwaj nieaktywne połączenia i tokeny expired

### ❌ NIGDY:
- **NIGDY Zwykła paginacja**: Nie używaj standardowej paginacji (duplikaty przy dodawaniu nowych)
- **NIGDY Logika biznesowa w Hub**: Hub tylko routing wiadomości, logika w HandlerÓw
- **NIGDY Broadcasting bez autoryzacji**: Zawsze sprawdzaj uprawnienia przed wysłaniem
- **NIGDY Synchroniczne operacje w Hub**: Wszystko async/await
- **NIGDY Connection state w bazie**: Przechowuj połączenia w pamięci (Dictionary/ConcurrentDictionary)

---

## 🏗️ Architektura Chat System

### 📁 Struktura Components

```
src/
├── Api/
│   ├── Hubs/
│   │   ├── ChatHub.cs                    # SignalR Hub dla real-time komunikacji
│   │   └── IChatClient.cs               # Interface dla client-side methods
│   ├── Controllers/
│   │   └── ChatController.cs            # REST endpoints dla chat funkcji
│   └── Services/
│       ├── IChatConnectionService.cs    # Interface zarządzania połączeniami
│       └── ChatConnectionService.cs     # Implementacja zarządzania połączeniami
├── Application/
│   ├── DTOs/Chat/
│   │   ├── MessageDto.cs                # DTO dla wiadomości
│   │   ├── ConversationDto.cs           # DTO dla konwersacji
│   │   ├── CreateMessageRequestDto.cs   # Request DTO tworzenia wiadomości
│   │   ├── GetMessagesRequestDto.cs     # Request DTO paginacji wiadomości
│   │   └── CreateConversationRequestDto.cs # Request DTO tworzenia konwersacji
│   ├── Features/Chat/
│   │   ├── Commands/
│   │   │   ├── CreateMessage/
│   │   │   │   ├── CreateMessageCommand.cs        # Command tworzenia wiadomości
│   │   │   │   └── CreateMessageCommandHandler.cs # Handler tworzenia wiadomości
│   │   │   ├── MarkAsRead/
│   │   │   │   ├── MarkAsReadCommand.cs           # Command oznaczania jako przeczytane
│   │   │   │   └── MarkAsReadCommandHandler.cs    # Handler oznaczania jako przeczytane
│   │   │   └── CreateConversation/
│   │   │       ├── CreateConversationCommand.cs        # Command tworzenia konwersacji
│   │   │       └── CreateConversationCommandHandler.cs # Handler tworzenia konwersacji
│   │   └── Queries/
│   │       ├── GetMessages/
│   │       │   ├── GetMessagesQuery.cs            # Query pobierania wiadomości
│   │       │   └── GetMessagesQueryHandler.cs     # Handler pobierania wiadomości
│   │       ├── GetConversations/
│   │       │   ├── GetConversationsQuery.cs       # Query pobierania konwersacji
│   │       │   └── GetConversationsQueryHandler.cs # Handler pobierania konwersacji
│   │       └── GetConversationById/
│   │           ├── GetConversationByIdQuery.cs    # Query pobierania konwersacji po ID
│   │           └── GetConversationByIdQueryHandler.cs # Handler pobierania konwersacji po ID
│   ├── Interfaces/
│   │   ├── IConversationRepository.cs   # Interface repozytorium konwersacji
│   │   └── IMessageRepository.cs        # Interface repozytorium wiadomości
│   └── Mappings/Chat/
│       └── ChatMappingProfile.cs        # AutoMapper profile dla chat
├── Infrastructure/
│   ├── Persistence/Repositories/
│   │   ├── ConversationRepository.cs    # Implementacja repozytorium konwersacji
│   │   └── MessageRepository.cs         # Implementacja repozytorium wiadomości
│   └── Persistence/Extensions/
│       └── MessageQueryableExtensions.cs # Extensions dla odwróconej paginacji wiadomości
```

---

## 🔄 KROK 1: Domain & Infrastructure Setup

### 1.1 Dodaj Interface Repositories w Application

**Lokalizacja**: `Application/Interfaces/`

- **IConversationRepository.cs**:
  - `GetByIdWithParticipantsAsync(int id)`
  - `GetByOfferIdAsync(int offerId)`
  - `GetByReviewIdAsync(int reviewId)` 
  - `GetUserConversationsAsync(string userId, int pageNumber, int pageSize)`
  - `CreateAsync(Conversation conversation)`
  - `IsUserParticipantAsync(int conversationId, string userId)`

- **IMessageRepository.cs**:
  - `GetConversationMessagesAsync(int conversationId, int pageNumber, int pageSize)` ← ODWRÓCONA PAGINACJA
  - `CreateAsync(Message message)`
  - `MarkAsReadAsync(int conversationId, string userId)`
  - `GetUnreadCountAsync(int conversationId, string userId)`
  - `GetLastMessageAsync(int conversationId)`

### 1.2 Dodaj Repositories w Infrastructure

**Lokalizacja**: `Infrastructure/Persistence/Repositories/`

- **ConversationRepository.cs**: Implementacja `IConversationRepository`
- **MessageRepository.cs**: Implementacja `IMessageRepository` z ODWRÓCONĄ PAGINACJĄ

### 1.3 Dodaj Extensions dla Odwróconej Paginacji

**Lokalizacja**: `Infrastructure/Persistence/Extensions/MessageQueryableExtensions.cs`

- **ToReversedPageResultAsync**: Extension method dla wiadomości
- Logika: Najnowsze wiadomości na końcu, starsze na początku
- Sortowanie: `ORDER BY SentAt ASC` ale paginacja od końca

### 1.4 Zaktualizuj IUnitOfWork

**Lokalizacja**: `Application/Interfaces/IUnitOfWork.cs`

- Dodaj właściwości: `IConversationRepository Conversations { get; }`
- Dodaj właściwości: `IMessageRepository Messages { get; }`

### 1.5 Zaktualizuj UnitOfWork Implementation

**Lokalizacja**: `Infrastructure/Persistence/UnitOfWork.cs`

- Zaimplementuj nowe właściwości z lazy loading

---

## 🔄 KROK 2: Application Layer - DTOs

### 2.1 DTOs Response

**Lokalizacja**: `Application/DTOs/Chat/`

- **MessageDto.cs**:
  - `Id`, `ConversationId`, `SenderId`, `SenderName`, `Content`
  - `SentAt`, `IsRead`, `OriginalUrl`, `MediumUrl`, `ThumbnailUrl`

- **ConversationDto.cs**:
  - `Id`, `OfferId`, `ReviewId`, `Participants` (List<UserDto>)
  - `LastMessage` (MessageDto), `UnreadCount`, `CreatedAt`

- **ConversationSummaryDto.cs**:
  - `Id`, `Title`, `LastMessageContent`, `LastMessageTime`
  - `UnreadCount`, `OtherParticipantName`, `OfferId`, `ReviewId`

### 2.2 Request DTOs z Walidacją

**Lokalizacja**: `Application/DTOs/Chat/`

- **CreateMessageRequestDto.cs**:
  - `[Required] ConversationId`
  - `[Required, MaxLength(1000)] Content`
  - `Photo` (IFormFile, opcjonalne)

- **GetMessagesRequestDto.cs**:
  - `[Required] ConversationId`
  - `[Range(1, int.MaxValue)] PageNumber = 1`
  - `[Range(1, 50)] PageSize = 20`

- **CreateConversationRequestDto.cs**:
  - `OfferId` (opcjonalne, dla konwersacji o ofercie)
  - `ReviewId` (opcjonalne, dla konwersacji o opinii)
  - `[Required] ParticipantId` (drugi uczestnik)

- **MarkAsReadRequestDto.cs**:
  - `[Required] ConversationId`

---

## 🔄 KROK 3: Application Layer - Commands & Queries

### 3.1 Commands (Write Operations)

**Lokalizacja**: `Application/Features/Chat/Commands/`

- **CreateMessageCommand.cs**:
  - `ConversationId`, `SenderId`, `Content`, `Photo`
  - Implements `IRequest<MessageDto>`

- **CreateMessageCommandHandler.cs**:
  - Waliduje uprawnienia (czy user jest uczestnikiem)
  - Przetwarza zdjęcie jeśli jest (IImageProcessingService)
  - Tworzy Message entity
  - Wywołuje SignalR notification
  - Zwraca MessageDto

- **MarkAsReadCommand.cs**:
  - `ConversationId`, `UserId`
  - Implements `IRequest`

- **MarkAsReadCommandHandler.cs**:
  - Oznacza wiadomości jako przeczytane
  - Wywołuje SignalR update o zmianie statusu

- **CreateConversationCommand.cs**:
  - `OfferId`, `ReviewId`, `InitiatorId`, `ParticipantId`
  - Implements `IRequest<ConversationDto>`

- **CreateConversationCommandHandler.cs**:
  - Sprawdza czy konwersacja już istnieje
  - Waliduje uprawnienia do tworzenia konwersacji
  - Tworzy nową konwersację z uczestnikami
  - Zwraca ConversationDto

### 3.2 Queries (Read Operations)

**Lokalizacja**: `Application/Features/Chat/Queries/`

- **GetMessagesQuery.cs**:
  - `ConversationId`, `UserId`, `PageNumber`, `PageSize`
  - Implements `IRequest<PageResult<MessageDto>>`

- **GetMessagesQueryHandler.cs**:
  - Sprawdza uprawnienia uczestnictwa w konwersacji
  - Używa ODWRÓCONEJ PAGINACJI z MessageRepository
  - Mapuje na MessageDto przez AutoMapper

- **GetConversationsQuery.cs**:
  - `UserId`, `PageNumber`, `PageSize`
  - Implements `IRequest<PageResult<ConversationSummaryDto>>`

- **GetConversationsQueryHandler.cs**:
  - Pobiera konwersacje użytkownika z ostatnią wiadomością
  - Liczy nieprzeczytane wiadomości
  - Mapuje na ConversationSummaryDto

- **GetConversationByIdQuery.cs**:
  - `ConversationId`, `UserId`
  - Implements `IRequest<ConversationDto>`

- **GetConversationByIdQueryHandler.cs**:
  - Sprawdza uprawnienia dostępu do konwersacji
  - Pobiera pełne dane konwersacji z uczestnikami
  - Mapuje na ConversationDto

---

## 🔄 KROK 4: AutoMapper Configuration

### 4.1 Chat Mapping Profile

**Lokalizacja**: `Application/Mappings/Chat/ChatMappingProfile.cs`

- **Mapowania**:
  - `Message` → `MessageDto`
  - `Conversation` → `ConversationDto`
  - `Conversation` → `ConversationSummaryDto` (z custom resolver dla last message)
  - `CreateMessageCommand` → `Message`
  - `CreateConversationCommand` → `Conversation`

---

## 🔄 KROK 5: Authorization Requirements & Handlers

### 5.1 Requirements

**Lokalizacja**: `Application/Authorization/Requirements/`

- **ConversationParticipantRequirement.cs**: Empty marker interface
- **ConversationInitiatorRequirement.cs**: Empty marker interface

### 5.2 Authorization Handlers

**Lokalizacja**: `Infrastructure/Authorization/`

- **ConversationParticipantAuthorizationHandler.cs**:
  - Sprawdza czy userId jest na liście uczestników konwersacji
  - Context: `AuthorizationHandlerContext`
  - Resource: `Conversation`

- **ConversationInitiatorAuthorizationHandler.cs**:
  - Dla ofert: guest może pisać do host
  - Dla opinii: autor może odpowiadać na komentarze
  - Context: `AuthorizationHandlerContext`
  - Resource: `Conversation + OfferId/ReviewId`

---

## 🔄 KROK 6: SignalR Infrastructure

### 6.1 Connection Service

**Lokalizacja**: `Api/Services/`

- **IChatConnectionService.cs**:
  - `AddConnectionAsync(string userId, string connectionId)`
  - `RemoveConnectionAsync(string connectionId)`
  - `GetConnectionsAsync(string userId)` → `List<string>`
  - `GetUserIdAsync(string connectionId)` → `string?`

- **ChatConnectionService.cs**:
  - Implementacja używająca `ConcurrentDictionary<string, string>` (connectionId → userId)
  - Implementacja używająca `ConcurrentDictionary<string, HashSet<string>>` (userId → connectionIds)
  - Thread-safe operacje

### 6.2 SignalR Client Interface

**Lokalizacja**: `Api/Hubs/IChatClient.cs`

- **Client Methods**:
  - `ReceiveMessage(MessageDto message)`
  - `MessageRead(int conversationId, string userId)`
  - `UserJoinedConversation(string userId, int conversationId)`
  - `UserLeftConversation(string userId, int conversationId)`
  - `ConversationCreated(ConversationDto conversation)`

### 6.3 ChatHub Implementation

**Lokalizacja**: `Api/Hubs/ChatHub.cs`

- **Metody Hub**:
  - `JoinConversationAsync(int conversationId)`: Dołącz do grupy konwersacji
  - `LeaveConversationAsync(int conversationId)`: Opuść grupę konwersacji
  - `OnConnectedAsync()`: Dodaj połączenie do service
  - `OnDisconnectedAsync()`: Usuń połączenie z service

- **Autoryzacja w Hub**:
  - Sprawdzaj `ConversationParticipantPolicy` przed dołączeniem do grupy
  - Używaj `IAuthorizationService` w Hub metodach
  - Pobieraj `userId` z `Context.User.Claims`

---

## 🔄 KROK 7: REST API Controller

### 7.1 ChatController

**Lokalizacja**: `Api/Controllers/ChatController.cs`

- **Endpoints**:
  - `POST /api/chat/conversations` → CreateConversation
  - `GET /api/chat/conversations` → GetUserConversations (z paginacją)
  - `GET /api/chat/conversations/{id}` → GetConversationById
  - `GET /api/chat/conversations/{id}/messages` → GetMessages (ODWRÓCONA PAGINACJA)
  - `POST /api/chat/conversations/{id}/messages` → CreateMessage
  - `PUT /api/chat/conversations/{id}/read` → MarkAsRead

- **Controller Logic**:
  - Pobiera `userId` z `User.Claims`
  - Mapuje Request DTOs na Commands/Queries
  - Wysyła do `IMediator`
  - Zwraca odpowiednie `ActionResult`

---

## 🔄 KROK 8: SignalR Integration w Handlers

### 8.1 Modify CreateMessageCommandHandler

- **Dodaj dependency**: `IHubContext<ChatHub, IChatClient>`
- **Po zapisaniu wiadomości**:
  - Pobierz uczestników konwersacji
  - Wyślij `ReceiveMessage` do grupy `conversation-{conversationId}`
  - Aktualizuj liczniki nieprzeczytanych wiadomości

### 8.2 Modify MarkAsReadCommandHandler

- **Dodaj dependency**: `IHubContext<ChatHub, IChatClient>`
- **Po oznaczeniu jako przeczytane**:
  - Wyślij `MessageRead` do grupy konwersacji
  - Aktualizuj UI innych uczestników

---

## 🔄 KROK 9: Registration & Configuration

### 9.1 Program.cs Configuration

- **SignalR Registration**: `builder.Services.AddSignalR()`
- **ChatConnectionService**: `builder.Services.AddSingleton<IChatConnectionService, ChatConnectionService>()`
- **Hub Mapping**: `app.MapHub<ChatHub>("/chatHub")`

### 9.2 DependencyInjection Updates

**Lokalizacja**: `Application/DependencyInjection.cs` & `Infrastructure/DependencyInjection.cs`

- Zarejestruj nowe repositories w Infrastructure DI
- Zarejestruj chat authorization policies w Infrastructure DI
- Zarejestruj AutoMapper chat profiles (automatyczne)

### 9.3 Authorization Policies

**Lokalizacja**: `Infrastructure/DependencyInjection.cs`

- **ConversationParticipantPolicy**: Requirement + Handler
- **ConversationInitiatorPolicy**: Requirement + Handler

---

## 🔄 KROK 10: Database Migrations & Updates

### 10.1 EF Core Configurations

**Lokalizacja**: `Infrastructure/Persistence/Configs/`

- **ConversationConfiguration.cs**: FK constraints, indexes na OfferId/ReviewId
- **MessageConfiguration.cs**: FK constraints, index na ConversationId + SentAt

### 10.2 Add Migration

- Uruchom: `dotnet ef migrations add AddChatSystem`
- Uruchom: `dotnet ef database update`

---

## 🚀 KROK 11: Testing Strategy

### 11.1 Unit Tests Priorities

**Lokalizacja**: `tests/Application.Tests/Features/Chat/`

- **Commands Tests**: CreateMessageCommandHandler, MarkAsReadCommandHandler
- **Queries Tests**: GetMessagesQueryHandler (paginacja), GetConversationsQueryHandler
- **Authorization Tests**: ConversationParticipant/InitiatorAuthorizationHandler

### 11.2 Integration Tests

**Lokalizacja**: `tests/Api.Tests/`

- **ChatController Tests**: Endpoints działanie z authorization
- **ChatHub Tests**: SignalR connection i group management

---

## 📊 ODWRÓCONA PAGINACJA - Szczegóły Implementacji

### Logika Odwróconej Paginacji:

1. **Standardowa paginacja**: Strona 1 = najstarsze wiadomości (PROBLEM: duplikaty przy dodawaniu nowych)
2. **Odwrócona paginacja**: Strona 1 = najnowsze wiadomości (ROZWIĄZANIE: nowe wiadomości na końcu)

### Implementacja w MessageRepository:

- **Query**: `ORDER BY SentAt ASC` (chronologicznie)
- **Paginacja**: Oblicz offset od końca zamiast od początku
- **Formula**: `offset = totalCount - (pageNumber * pageSize)`
- **Extension**: `ToReversedPageResultAsync()` w MessageQueryableExtensions

### Frontend Integration:

- **Strona 1**: Najnowsze wiadomości (scroll na dół)
- **Load More**: Starsze wiadomości (scroll w górę)
- **Nowe wiadomości**: Dodawane na końcu bez wpływu na paginację

---

## 🔧 Kolejność Implementacji (Execution Order)

1. **KROK 1**: Domain & Infrastructure Setup
2. **KROK 2**: Application DTOs
3. **KROK 3**: Commands & Queries + Handlers
4. **KROK 4**: AutoMapper Profiles
5. **KROK 5**: Authorization Requirements & Handlers
6. **KROK 9**: DI Registration & Policies
7. **KROK 10**: Database Migration
8. **KROK 6**: SignalR Services & Connection Management
9. **KROK 7**: REST API Controller
10. **KROK 8**: SignalR Integration w Handlers
11. **KROK 9.1**: Program.cs SignalR Configuration
12. **KROK 11**: Testing

---

*Plan implementacji - wersja 2025-11-11*
