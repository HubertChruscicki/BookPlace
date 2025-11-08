using System.Text.Json.Serialization;
using Application.Common.Pagination;
using Application.DTOs.Bookings;
using MediatR;
using Swashbuckle.AspNetCore.Annotations;

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
    
    [JsonIgnore]
    [SwaggerIgnore]
    public string UserId { get; internal set; } = string.Empty;
}
