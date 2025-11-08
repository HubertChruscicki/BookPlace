using Application.DTOs.Bookings;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Bookings.Queries.GetBookingById;

/// <summary>
/// Handler for retrieving a specific booking by ID with resource-based authorization
/// </summary>
public class GetBookingByIdQueryHandler : IRequestHandler<GetBookingByIdQuery, BookingDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetBookingByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper, IAuthorizationService authorizationService, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Retrieves booking by ID with authorization check (BookingParticipantPolicy)
    /// </summary>
    /// <param name="request">Query with booking ID and user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Booking DTO if user is authorized</returns>
    /// <exception cref="KeyNotFoundException">When booking is not found</exception>
    /// <exception cref="UnauthorizedAccessException">When user is not authorized to view booking</exception>
    public async Task<BookingDto> Handle(GetBookingByIdQuery request, CancellationToken cancellationToken)
    {
        var booking = await _unitOfWork.Bookings.GetByIdAsync(request.BookingId, cancellationToken);
        if (booking == null)
        {
            throw new KeyNotFoundException($"Booking with ID {request.BookingId} not found");
        }

        var user = _httpContextAccessor.HttpContext?.User;

        var authorizationResult = await _authorizationService
            .AuthorizeAsync(user!, booking, "BookingParticipantPolicy");

        if (!authorizationResult.Succeeded)
        {
            throw new UnauthorizedAccessException("You are not authorized to view this booking");
        }

        return _mapper.Map<BookingDto>(booking);
    }
}
