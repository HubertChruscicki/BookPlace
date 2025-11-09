using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Bookings;

/// <summary>
/// DTO for updating an existing offer
/// </summary>
public class UpdateOfferRequestDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int OfferTypeId { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 5)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(2000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(1, 100000)]
    public decimal PricePerNight { get; set; }

    [Required]
    [Range(1, 50)]
    public int MaxGuests { get; set; }

    [Required]
    [Range(1, 50)]
    public int Rooms { get; set; }
    
    [Range(0, 50)]
    public int SingleBeds { get; set; }
    
    [Range(0, 50)]
    public int DoubleBeds { get; set; }
    
    [Range(0, 50)]
    public int Sofas { get; set; }

    [Required]
    [Range(1, 20)]
    public int Bathrooms { get; set; }

    [Required]
    [StringLength(200)]
    public string AddressStreet { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string AddressCity { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string AddressZipCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string AddressCountry { get; set; } = string.Empty;
    
    public double? AddressLatitude { get; set; }
    public double? AddressLongitude { get; set; }

    public List<int> AmenityIds { get; set; } = new List<int>();
}