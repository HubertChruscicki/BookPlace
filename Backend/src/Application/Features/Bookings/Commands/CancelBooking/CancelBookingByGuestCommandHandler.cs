using Application.DTOs.Bookings;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Bookings.Commands.CancelBooking;

/// <summary>
/// Handler for cancelling a booking by the Guest
/// </summary>
public class CancelBookingByGuestCommandHandler : IRequestHandler<CancelBookingByGuestCommand, BookingDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CancelBookingByGuestCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuthorizationService authorizationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<BookingDto> Handle(CancelBookingByGuestCommand request, CancellationToken cancellationToken)
    {
        var booking = await _unitOfWork.Bookings.GetByIdForUpdateAsync(request.BookingId, cancellationToken);
        if (booking == null)
        {
            throw new KeyNotFoundException($"Booking with ID {request.BookingId} not found");
        }

        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null || !user.Identity.IsAuthenticated)
        {
            throw new UnauthorizedAccessException("User context not found");
        }

        var authorizationResult = await _authorizationService
            .AuthorizeAsync(user, booking, "BookingOwnerPolicy");

        if (!authorizationResult.Succeeded)
        {
            throw new UnauthorizedAccessException("You are not authorized to cancel this booking as a guest");
        }

        if (booking.Status != BookingStatus.Confirmed && booking.Status != BookingStatus.Pending)
        {
            throw new InvalidOperationException($"Cannot cancel booking with status '{booking.Status}'");
        }

        booking.Status = BookingStatus.CancelledByGuest;
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<BookingDto>(booking);
    }
}