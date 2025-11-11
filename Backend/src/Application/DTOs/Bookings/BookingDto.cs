using System.Text.Json.Serialization;
using Domain.Entities;

namespace Application.DTOs.Bookings;
public class BookingDto
{
    public int Id { get; set; }

    public string GuestId { get; set; } = string.Empty;

    public int OfferId { get; set; }

    public DateTime CheckInDate { get; set; }

    public DateTime CheckOutDate { get; set; }

    public decimal TotalPrice { get; set; }

    public int NumberOfGuests { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public string? OfferTitle { get; set; }
    public string? OfferCity { get; set; }
    public string? OfferCountry { get; set; }
    public string? OfferCoverPhotoUrl { get; set; }
}
