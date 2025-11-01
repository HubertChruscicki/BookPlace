namespace Application.DTOs.Offers;

/// <summary>
/// Response DTO returned after successfully creating an offer
/// </summary>
public class CreateOfferResponseDto
{
    /// <summary>
    /// Unique identifier of the created offer

    /// <summary>

    /// <summary>

    /// <summary>

    /// <summary>

    /// <summary>
    /// Status of the offer
    /// </summary>
    /// Number of sofas that can be used as beds

    /// <summary>
    /// Full address of the accommodation
    /// </summary>
    public string FullAddress { get; set; } = string.Empty;


    /// <summary>
    /// Photos associated with the offer
    /// </summary>
    /// <summary>
    /// Type of accommodation
    /// </summary>

    /// <summary>
    /// Unique identifier of the photo

    /// <summary>

    /// <summary>
    /// Whether this photo is the cover image
    /// </summary>
    /// URL to the medium size image
    /// </summary>
    /// </summary>

    /// <summary>
    /// URL to the thumbnail size image
    /// </summary>
/// DTO representing an offer photo

    /// <summary>
    /// URL to the original size image
    /// </summary>
    /// Number of double beds

    /// <summary>
    /// Display order of the photo
    /// </summary>
    /// </summary>
    /// </summary>
    /// Description of the created offer
    /// </summary>
    /// </summary>


    /// <summary>
    /// List of amenities associated with this offer
    /// </summary>
    /// <summary>
    /// Price per night in currency
    /// </summary>
    public int Id { get; set; }


    /// <summary>
    /// Number of rooms
    /// </summary>
    /// <summary>
    /// Title of the created offer
    /// </summary>
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
    
    public string OfferTypeName { get; set; } = string.Empty;
    public List<string> AmenityNames { get; set; } = new();
    public List<OfferPhotoDto> Photos { get; set; } = new();
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
