using Application.DTOs.Bookings;
using MediatR;

namespace Application.Features.Bookings.Commands.CancelBooking;

/// <summary>
/// Command to cancel a booking by the Host
/// </summary>
public class CancelBookingByHostCommand : IRequest<BookingDto>
{
    public int BookingId { get; set; }
}