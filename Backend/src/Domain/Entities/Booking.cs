using Domain.Enums;

namespace Domain.Entities;

public class Booking
{
    public int Id { get; set; }
    public string GuestId { get; set; } = string.Empty;
    public int OfferId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalPrice { get; set; }
    public int NumberOfGuests { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public User Guest { get; set; } = null!;
    public Offer Offer { get; set; } = null!;
    public Review? Review { get; set; }
}
