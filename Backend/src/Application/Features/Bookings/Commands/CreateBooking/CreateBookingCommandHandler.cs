﻿using Application.DTOs.Bookings;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Bookings.Commands.CreateBooking;

/// <summary>
/// Handler for creating a new booking
/// </summary>
public class CreateBookingCommandHandler : IRequestHandler<CreateBookingCommand, BookingDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateBookingCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, IAuthorizationService authorizationService, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Handles the creation of a new booking with business validation
    /// </summary>
    /// <param name="request">Create booking command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created booking DTO</returns>
    /// <exception cref="KeyNotFoundException">When offer is not found</exception>
    /// <exception cref="InvalidOperationException">When business rules are violated</exception>
    public async Task<BookingDto> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
    {
        var offer = await _unitOfWork.Offers.GetByIdAsync(request.OfferId, cancellationToken);
        if (offer == null)
        {
            throw new KeyNotFoundException($"Offer with ID {request.OfferId} not found");
        }

        var user = _httpContextAccessor.HttpContext?.User;
        if (user != null)
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(user, offer, "OfferViewPolicy");
            if (!authorizationResult.Succeeded)
            {
                throw new UnauthorizedAccessException("You are not authorized to book this offer");
            }
            
        }

        ValidateBusinessRules(request, offer);

        var isAvailable = await _unitOfWork.Bookings.IsDateRangeAvailableAsync(
            request.OfferId, 
            request.CheckInDate, 
            request.CheckOutDate, 
            cancellationToken);

        if (!isAvailable)
        {
            throw new InvalidOperationException("Selected dates are not available for booking");
        }

        var totalPrice = CalculateTotalPrice(offer.PricePerNight, request.CheckInDate, request.CheckOutDate);
 
        var booking = new Booking
        {
            GuestId = request.GuestId,
            OfferId = request.OfferId,
            CheckInDate = request.CheckInDate.Date, 
            CheckOutDate = request.CheckOutDate.Date,
            NumberOfGuests = request.NumberOfGuests,
            TotalPrice = totalPrice,
            Status = BookingStatus.Confirmed,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Bookings.AddAsync(booking, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<BookingDto>(booking);
    }

    /// <summary>
    /// Validates business rules for booking creation
    /// </summary>
    /// <param name="request">Create booking command</param>
    /// <param name="offer">Target offer</param>
    /// <exception cref="InvalidOperationException">When business rules are violated</exception>
    private static void ValidateBusinessRules(CreateBookingCommand request, Offer offer)
    {
        if (offer.Status != OfferStatus.Active)
        {
            throw new InvalidOperationException("Cannot book an inactive offer");
        }
        if (offer.IsArchive)
        {
            throw new InvalidOperationException("Cannot book an archived offer");
        }
        if (request.NumberOfGuests > offer.MaxGuests)
        {
            throw new InvalidOperationException($"Number of guests ({request.NumberOfGuests}) exceeds maximum allowed ({offer.MaxGuests})");
        }
        if (request.CheckInDate >= request.CheckOutDate)
        {
            throw new InvalidOperationException("Check-in date must be before check-out date");
        }
        if (request.CheckInDate.Date < DateTime.UtcNow.Date)
        {
            throw new InvalidOperationException("Check-in date cannot be in the past");
        }
        if (request.GuestId == offer.HostId)
        {
            throw new InvalidOperationException("You cannot book your own offer");
        }
    }

    /// <summary>
    /// Calculates total price based on price per night and date range
    /// </summary>
    /// <param name="pricePerNight">Price per night</param>
    /// <param name="checkInDate">Check-in date</param>
    /// <param name="checkOutDate">Check-out date</param>
    /// <returns>Total calculated price</returns>
    private static decimal CalculateTotalPrice(decimal pricePerNight, DateTime checkInDate, DateTime checkOutDate)
    {
        var numberOfNights = (checkOutDate.Date - checkInDate.Date).Days;
        return pricePerNight * numberOfNights;
    }
}
