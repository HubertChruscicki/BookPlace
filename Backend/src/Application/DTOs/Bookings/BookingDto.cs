using Application.DTOs.Offers;
using System.Text.Json.Serialization;
using Domain.Entities;

namespace Application.DTOs.Bookings;

/// <summary>
/// DTO representing a booking with offer summary and host details.
/// </summary>
public class BookingDto
{
    public int Id { get; set; }

    public string GuestId { get; set; } = string.Empty;

    public int OfferId { get; set; }

    public DateOnly CheckInDate { get; set; }

    public DateOnly CheckOutDate { get; set; }

    public decimal TotalPrice { get; set; }

    public int NumberOfGuests { get; set; }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public BookingOfferDto Offer { get; set; } = new();
    public OfferHostDto Host { get; set; } = new();
    public BookingGuestDto Guest { get; set; } = new();
}
