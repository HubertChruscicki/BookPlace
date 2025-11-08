using Application.DTOs.Bookings;
using MediatR;

namespace Application.Features.Bookings.Commands.CreateBooking;

/// <summary>
/// Command for creating a new booking
/// </summary>
public class CreateBookingCommand : IRequest<BookingDto>
{
    public int OfferId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int NumberOfGuests { get; set; }
    public string GuestId { get; set; } = string.Empty;
}
