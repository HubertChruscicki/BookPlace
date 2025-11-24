namespace Application.DTOs.Bookings;

/// <summary>
/// Represents the publicly exposed guest information for a booking.
/// </summary>
public class BookingGuestDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}
