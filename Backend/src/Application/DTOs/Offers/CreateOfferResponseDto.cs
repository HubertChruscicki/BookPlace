namespace Application.DTOs.Offers;

/// <summary>
/// Response DTO returned after successfully creating an offer
/// </summary>
public class CreateOfferResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int MaxGuests { get; set; }
    public int Rooms { get; set; }
    public int SingleBeds { get; set; }
    public int DoubleBeds { get; set; }
    public int Sofas { get; set; }
    public int Bathrooms { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AddressStreet { get; set; } = string.Empty;
    public string AddressCity { get; set; } = string.Empty;
    public string AddressZipCode { get; set; } = string.Empty;
    public string AddressCountry { get; set; } = string.Empty;
    public double? AddressLatitude { get; set; }
    public double? AddressLongitude { get; set; }
    public string FullAddress { get; set; } = string.Empty;
    public OfferTypeDto OfferType { get; set; } = new();
    public List<AmenityDto> Amenities { get; set; } = new();
}

/// <summary>
/// DTO representing an offer type
/// </summary>
public class OfferTypeDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// DTO representing an amenity
/// </summary>
public class AmenityDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// DTO for offer photo URLs
/// </summary>
public class OfferPhotoDto
{
    public int Id { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string MediumUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public bool IsCover { get; set; }
    public int SortOrder { get; set; }
}
