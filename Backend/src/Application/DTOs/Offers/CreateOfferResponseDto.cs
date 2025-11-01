namespace Application.DTOs.Offers;

/// <summary>
/// Response DTO returned after successfully creating an offer
/// </summary>
public class CreateOfferResponseDto
{
    /// <summary>
    /// Unique identifier of the created offer
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Title of the created offer
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Description of the created offer
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Price per night in currency
    /// </summary>
    public decimal PricePerNight { get; set; }

    /// <summary>
    /// Maximum number of guests allowed
    /// </summary>
    public int MaxGuests { get; set; }

    /// <summary>
    /// Number of rooms
    /// </summary>
    public int Rooms { get; set; }

    /// <summary>
    /// Number of single beds
    /// </summary>
    public int SingleBeds { get; set; }

    /// <summary>
    /// Number of double beds
    /// </summary>
    public int DoubleBeds { get; set; }

    /// <summary>
    /// Number of sofas that can be used as beds
    /// </summary>
    public int Sofas { get; set; }

    /// <summary>
    /// Number of bathrooms
    /// </summary>
    public int Bathrooms { get; set; }

    /// <summary>
    /// Status of the offer
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Full address of the accommodation
    /// </summary>
    public string FullAddress { get; set; } = string.Empty;

    /// <summary>
    /// Type of accommodation
    /// </summary>
    public string OfferTypeName { get; set; } = string.Empty;

    /// <summary>
    /// List of amenities associated with this offer
    /// </summary>
    public List<string> AmenityNames { get; set; } = new();

    /// <summary>
    /// Photos associated with the offer
    /// </summary>
    public List<OfferPhotoDto> Photos { get; set; } = new();
}

/// <summary>
/// DTO representing an offer photo
/// </summary>
public class OfferPhotoDto
{
    /// <summary>
    /// Unique identifier of the photo
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// URL to the original size image
    /// </summary>
    public string OriginalUrl { get; set; } = string.Empty;

    /// <summary>
    /// URL to the medium size image
    /// </summary>
    public string MediumUrl { get; set; } = string.Empty;

    /// <summary>
    /// URL to the thumbnail size image
    /// </summary>
    public string ThumbnailUrl { get; set; } = string.Empty;

    /// <summary>
    /// Whether this photo is the cover image
    /// </summary>
    public bool IsCover { get; set; }

    /// <summary>
    /// Display order of the photo
    /// </summary>
    public int SortOrder { get; set; }
}
