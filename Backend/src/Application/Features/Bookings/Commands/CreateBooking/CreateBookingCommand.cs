using Application.DTOs.Bookings;
using MediatR;

namespace Application.Features.Bookings.Commands.CreateBooking;

/// <summary>
/// Command for creating a new booking
/// </summary>
public class CreateBookingCommand : IRequest<BookingDto>
{
    public int OfferId { get; set; }
    public DateOnly CheckInDate { get; set; }
    public DateOnly CheckOutDate { get; set; }
    public int NumberOfGuests { get; set; }
    public string GuestId { get; set; } = string.Empty;
}
