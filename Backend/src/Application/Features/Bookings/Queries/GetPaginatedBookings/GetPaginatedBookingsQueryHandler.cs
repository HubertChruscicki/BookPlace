using Application.Common.Pagination;
using Application.DTOs.Bookings;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Bookings.Queries.GetPaginatedBookings;

/// <summary>
/// Handler for retrieving a paginated list of user bookings with filtering options
/// </summary>
public class GetPaginatedBookingsQueryHandler : IRequestHandler<GetPaginatedBookingsQuery, PageResult<BookingDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetPaginatedBookingsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    /// <summary>
    /// Retrieves a paginated list of user bookings with applied filters
    /// </summary>
    /// <param name="request">Query with filtering and pagination parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated result with booking list</returns>
    public async Task<PageResult<BookingDto>> Handle(GetPaginatedBookingsQuery request, CancellationToken cancellationToken)
    {
        var bookingsPageResult = await _unitOfWork.Bookings.GetPaginatedBookingsAsync(
            request.UserId,
            request.PageNumber,
            request.PageSize,
            request.Role,
            request.Status,
            request.OfferId,
            request.DateFrom,
            request.DateTo);

        var bookingDtos = _mapper.Map<List<BookingDto>>(bookingsPageResult.Items);

        return new PageResult<BookingDto>(
            bookingDtos,
            bookingsPageResult.TotalItemsCount,
            bookingsPageResult.PageNumber,
            bookingsPageResult.PageSize);
    }
}
