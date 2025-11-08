using Application.Common.Pagination;
using Application.DTOs.Bookings;
using MediatR;

namespace Application.Features.Bookings.Queries.GetPaginatedBookings;

/// <summary>
/// Query for retrieving a paginated list of user bookings with filtering options
/// </summary>
public class GetPaginatedBookingsQuery : IRequest<PageResult<BookingDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Role { get; set; }
    public string? Status { get; set; }
    public int? OfferId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string UserId { get; set; } = string.Empty;
}
