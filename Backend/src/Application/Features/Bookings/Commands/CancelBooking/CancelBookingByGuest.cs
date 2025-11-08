using Application.DTOs.Bookings;
using MediatR;

namespace Application.Features.Bookings.Commands.CancelBooking;

/// <summary>
/// Command to cancel a booking by the Guest
/// </summary>
public class CancelBookingByGuestCommand : IRequest<BookingDto>
{
    public int BookingId { get; set; }
}