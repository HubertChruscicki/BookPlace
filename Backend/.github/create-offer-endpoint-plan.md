# 🏗️ Plan Implementacji: POST /api/offer

## 📋 Wymagania
- **Authorization**: Role "Host" (JWT Claims)
- **Payload**: JSON z DTO + zdjęcia w Base64
- **Image Processing**: 3 rozmiary (Original, Medium, Thumbnail)
- **Clean Architecture**: CQRS/MediatR pattern

---

## 🎯 Implementacja (13 plików)

### 1. **Domain** - Metody fabryczne
**`Domain/Entities/Offer.cs`**
```csharp
public static Offer Create(string hostId, CreateOfferDto dto) 
    => new() { HostId = hostId, Status = OfferStatus.Active, /* mapowanie */ };

public void AddPhoto(string originalUrl, string mediumUrl, string thumbnailUrl, bool isCover)
    => Photos.Add(new OfferPhoto { /* ustawienia */ });
```

### 2. **Application Layer**

#### DTOs
**`Application/DTOs/Offers/CreateOfferDto.cs`**
```csharp
public class CreateOfferDto
{
    [Required] public string Title { get; set; }
    [Required] public string Description { get; set; }
    [Range(0.01, double.MaxValue)] public decimal PricePerNight { get; set; }
    [Range(1, 50)] public int MaxGuests { get; set; }
    [Required] public int OfferTypeId { get; set; }
    public List<int> AmenityIds { get; set; } = new();
    
    // Adres (wszystkie Required)
    public string AddressStreet/City/ZipCode/Country { get; set; }
    public double? AddressLatitude/Longitude { get; set; }
    
    // Zdjęcia
    public List<CreateOfferPhotoDto> Photos { get; set; } = new();
}

public class CreateOfferPhotoDto
{
    [Required] public string Base64Data { get; set; }
    [Required] public string FileName { get; set; }
    public bool IsCover { get; set; }
}
```

#### Command & Handler
**`Application/Features/Offers/Commands/CreateOfferCommand.cs`**
```csharp
public class CreateOfferCommand : IRequest<CreateOfferResponseDto>
{
    public string UserId { get; set; }
    public CreateOfferDto OfferData { get; set; }
}
```

**`Application/Features/Offers/Commands/CreateOfferCommandHandler.cs`**
```csharp
public class CreateOfferCommandHandler : IRequestHandler<CreateOfferCommand, CreateOfferResponseDto>
{
    // DI: IOfferRepository, IImageProcessingService, IMapper
    
    public async Task<CreateOfferResponseDto> Handle(...)
    {
        // 1. Walidacja OfferType + Amenities (czy istnieją)
        // 2. Offer.Create(userId, dto)
        // 3. Przetwarzanie zdjęć (Base64 → 3 rozmiary)
        // 4. offer.AddPhoto() dla każdego
        // 5. Repository.CreateAsync(offer)
        // 6. Mapping + return
    }
}
```

#### Interfaces
**`Application/Interfaces/IImageProcessingService.cs`**
```csharp
public interface IImageProcessingService
{
    Task<ProcessedImageResult> ProcessImageAsync(string base64Data, string fileName);
}

public class ProcessedImageResult
{
    public string OriginalUrl { get; set; }
    public string MediumUrl { get; set; }
    public string ThumbnailUrl { get; set; }
}
```

**`Application/Interfaces/IOfferRepository.cs` (rozszerzenie)**
```csharp
Task<Offer> CreateAsync(Offer offer);
Task<bool> OfferTypeExistsAsync(int offerTypeId);
Task<List<Amenity>> GetAmenitiesByIdsAsync(List<int> amenityIds);
```

#### Authorization
**`Application/Authorization/Requirements/HostRoleRequirement.cs`**
```csharp
public class HostRoleRequirement : IAuthorizationRequirement { }
```

#### Mapping
**`Application/Mappings/Offers/OfferMappingProfile.cs`**
```csharp
CreateMap<CreateOfferDto, Offer>();
CreateMap<Offer, CreateOfferResponseDto>();
CreateMap<OfferPhoto, OfferPhotoDto>();
```

### 3. **Infrastructure Layer**

#### Image Processing
**`Infrastructure/Services/ImageProcessingService.cs`**
```csharp
public class ImageProcessingService : IImageProcessingService
{
    public async Task<ProcessedImageResult> ProcessImageAsync(string base64Data, string fileName)
    {
        // 1. Dekodowanie Base64 → byte[]
        // 2. Walidacja formatu (JPEG/PNG)
        // 3. Resize: Original(2048px), Medium(800px), Thumbnail(200px)
        // 4. Zapis: wwwroot/uploads/offers/{guid}/
        // 5. Return URLs
    }
}
```

#### Repository Implementation
**`Infrastructure/Persistence/Repositories/OfferRepository.cs`**
```csharp
public async Task<Offer> CreateAsync(Offer offer)
{
    _context.Offers.Add(offer);
    await _context.SaveChangesAsync();
    return offer;
}

public async Task<bool> OfferTypeExistsAsync(int offerTypeId)
    => await _context.OfferTypes.AnyAsync(x => x.Id == offerTypeId);

public async Task<List<Amenity>> GetAmenitiesByIdsAsync(List<int> amenityIds)
    => await _context.Amenities.Where(x => amenityIds.Contains(x.Id)).ToListAsync();
```

#### Authorization Handler
**`Infrastructure/Authorization/HostRoleAuthorizationHandler.cs`**
```csharp
public class HostRoleAuthorizationHandler : AuthorizationHandler<HostRoleRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HostRoleRequirement requirement)
    {
        if (context.User.IsInRole("Host"))
            context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
```

### 4. **API Layer**

#### Controller
**`Api/Controllers/OfferController.cs` (dodanie endpointu)**
```csharp
[HttpPost]
[Authorize(Policy = "HostOnly")]
public async Task<IActionResult> CreateOffer([FromBody] CreateOfferDto dto)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
    
    var command = new CreateOfferCommand { UserId = userId, OfferData = dto };
    var result = await _mediator.Send(command);
    
    return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
}
```

### 5. **Configuration**

#### DI Registration
**`Infrastructure/DependencyInjection.cs`**
```csharp
services.AddScoped<IImageProcessingService, ImageProcessingService>();
services.AddScoped<IAuthorizationHandler, HostRoleAuthorizationHandler>();
```

#### Authorization Policy
**`Api/Program.cs`**
```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("HostOnly", policy =>
        policy.Requirements.Add(new HostRoleRequirement()));
});
```

---

## 🔄 Request Flow
1. **POST** `/api/offer` + JSON (CreateOfferDto)
2. **Auth**: Policy "HostOnly" → sprawdza rolę "Host"
3. **Validation**: Automatyczna walidacja atrybutów DTO
4. **Controller**: userId z Claims → CreateOfferCommand → MediatR
5. **Handler**: Walidacja biznesowa → Offer.Create() → Image processing → Repository
6. **Response**: **201 Created** + CreateOfferResponseDto

---

## 📁 Pliki do Utworzenia (8)
1. `Application/Features/Offers/Commands/CreateOfferCommand.cs`
2. `Application/Features/Offers/Commands/CreateOfferCommandHandler.cs`
3. `Application/DTOs/Offers/CreateOfferDto.cs`
4. `Application/DTOs/Offers/CreateOfferResponseDto.cs`
5. `Application/Interfaces/IImageProcessingService.cs`
6. `Application/Authorization/Requirements/HostRoleRequirement.cs`
7. `Infrastructure/Services/ImageProcessingService.cs`
8. `Infrastructure/Authorization/HostRoleAuthorizationHandler.cs`

## 📝 Pliki do Modyfikacji (5)
1. `Domain/Entities/Offer.cs` - metody Create() + AddPhoto()
2. `Application/Interfaces/IOfferRepository.cs` - nowe metody
3. `Infrastructure/Persistence/Repositories/OfferRepository.cs` - implementacja
4. `Api/Controllers/OfferController.cs` - endpoint POST
5. `Infrastructure/DependencyInjection.cs` - rejestracja serwisów
