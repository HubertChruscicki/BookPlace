namespace Application.DTOs.Bookings;

/// <summary>
/// DTO representing offer details in the context of a booking
/// </summary>
public class BookingOfferDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string AddressStreet { get; set; } = string.Empty;
    public string AddressCity { get; set; } = string.Empty;
    public string AddressZipCode { get; set; } = string.Empty;
    public string AddressCountry { get; set; } = string.Empty;
    public string FullAddress { get; set; } = string.Empty;
    public double? AddressLatitude { get; set; }
    public double? AddressLongitude { get; set; }
    public string? CoverPhotoUrl { get; set; }
    public string OfferType { get; set; } = string.Empty;
}
