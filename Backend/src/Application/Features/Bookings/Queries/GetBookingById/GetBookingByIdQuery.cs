using Application.DTOs.Bookings;
using MediatR;

namespace Application.Features.Bookings.Queries.GetBookingById;

/// <summary>
/// Query for retrieving a specific booking by ID with authorization check
/// </summary>
public class GetBookingByIdQuery : IRequest<BookingDto>
{
    public int BookingId { get; set; }
}
