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

