namespace Application.Common.Contracts;

public record BookingMade
{
    public int BookingId { get; init; }
    public string RecipientEmail { get; init; } = String.Empty;
    public string RecipientName { get; init; } = String.Empty;
    public string OfferTitle { get; set; } = String.Empty;
    public string OfferCity { get; set; } = String.Empty;
    public string OfferCountry { get; set; } = String.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
}