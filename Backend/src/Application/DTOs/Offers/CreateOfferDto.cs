using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Offers;

/// <summary>
/// DTO for creating a new offer
/// </summary>
public class CreateOfferDto
{
    /// <summary>
    /// Title of the offer
    /// </summary>
    [Required(ErrorMessage = "Title is required")]
    [MinLength(5, ErrorMessage = "Title must be at least 5 characters long")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Detailed description of the offer
    /// </summary>
    [Required(ErrorMessage = "Description is required")]
    [MinLength(20, ErrorMessage = "Description must be at least 20 characters long")]
    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Price per night in currency
    /// </summary>
    [Required(ErrorMessage = "Price per night is required")]
    [Range(0.01, 10000.00, ErrorMessage = "Price must be between 0.01 and 10000.00")]
    public decimal PricePerNight { get; set; }

    /// <summary>
    /// Maximum number of guests allowed
    /// </summary>
    [Required(ErrorMessage = "Maximum guests is required")]
    [Range(1, 50, ErrorMessage = "Maximum guests must be between 1 and 50")]
    public int MaxGuests { get; set; }

    /// <summary>
    /// Number of rooms
    /// </summary>
    [Required(ErrorMessage = "Number of rooms is required")]
    [Range(1, 20, ErrorMessage = "Rooms must be between 1 and 20")]
    public int Rooms { get; set; }

    /// <summary>
    /// Number of single beds
    /// </summary>
    [Required(ErrorMessage = "Number of single beds is required")]
    [Range(0, 50, ErrorMessage = "Single beds must be between 0 and 50")]
    public int SingleBeds { get; set; }

    /// <summary>
    /// Number of double beds
    /// </summary>
    [Required(ErrorMessage = "Number of double beds is required")]
    [Range(0, 20, ErrorMessage = "Double beds must be between 0 and 20")]
    public int DoubleBeds { get; set; }

    /// <summary>
    /// Number of sofas that can be used as beds
    /// </summary>
    [Required(ErrorMessage = "Number of sofas is required")]
    [Range(0, 20, ErrorMessage = "Sofas must be between 0 and 20")]
    public int Sofas { get; set; }

    /// <summary>
    /// Number of bathrooms
    /// </summary>
    [Required(ErrorMessage = "Number of bathrooms is required")]
    [Range(1, 20, ErrorMessage = "Bathrooms must be between 1 and 20")]
    public int Bathrooms { get; set; }

    /// <summary>
    /// Type of accommodation
    /// </summary>
    [Required(ErrorMessage = "Offer type is required")]
    public int OfferTypeId { get; set; }

    /// <summary>
    /// List of amenity IDs associated with this offer
    /// </summary>
    public List<int> AmenityIds { get; set; } = new();

    /// <summary>
    /// Street address of the accommodation
    /// </summary>
    [Required(ErrorMessage = "Street address is required")]
    [MaxLength(200, ErrorMessage = "Street address cannot exceed 200 characters")]
    public string AddressStreet { get; set; } = string.Empty;

    /// <summary>
    /// City where the accommodation is located
    /// </summary>
    [Required(ErrorMessage = "City is required")]
    [MaxLength(100, ErrorMessage = "City cannot exceed 100 characters")]
    public string AddressCity { get; set; } = string.Empty;

    /// <summary>
    /// ZIP code of the accommodation location
    /// </summary>
    [Required(ErrorMessage = "ZIP code is required")]
    [MaxLength(20, ErrorMessage = "ZIP code cannot exceed 20 characters")]
    public string AddressZipCode { get; set; } = string.Empty;

    /// <summary>
    /// Country where the accommodation is located
    /// </summary>
    [Required(ErrorMessage = "Country is required")]
    [MaxLength(100, ErrorMessage = "Country cannot exceed 100 characters")]
    public string AddressCountry { get; set; } = string.Empty;

    /// <summary>
    /// Latitude coordinate for precise location
    /// </summary>
    [Range(-90.0, 90.0, ErrorMessage = "Latitude must be between -90 and 90")]
    public double? AddressLatitude { get; set; }

    /// <summary>
    /// Longitude coordinate for precise location
    /// </summary>
    [Range(-180.0, 180.0, ErrorMessage = "Longitude must be between -180 and 180")]
    public double? AddressLongitude { get; set; }

    /// <summary>
    /// Photos to be uploaded with the offer
    /// </summary>
    public List<CreateOfferPhotoDto> Photos { get; set; } = new();
}

/// <summary>
/// DTO for offer photo upload
/// </summary>
public class CreateOfferPhotoDto
{
    /// <summary>
    /// Base64 encoded image data
    /// </summary>
    [Required(ErrorMessage = "Base64 image data is required")]
    public string Base64Data { get; set; } = string.Empty;


    /// <summary>
    /// Whether this photo should be the cover image
    /// </summary>
    public bool IsCover { get; set; } = false;
}
