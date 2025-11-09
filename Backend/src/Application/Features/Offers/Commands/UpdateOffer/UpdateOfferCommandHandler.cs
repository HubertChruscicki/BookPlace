using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Offers.Commands.UpdateOffer;

/// <summary>
/// Handler for UpdateOfferCommand
/// </summary>
public class UpdateOfferCommandHandler : IRequestHandler<UpdateOfferCommand, OfferDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateOfferCommandHandler(IUnitOfWork unitOfWork, IMapper mapper, IAuthorizationService authorizationService, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<OfferDto> Handle(UpdateOfferCommand request, CancellationToken ct)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
            throw new UnauthorizedAccessException("User context not found.");

        var offer = await _unitOfWork.Offers.GetByIdAsync(request.OfferId, ct);
        if (offer == null)
            throw new KeyNotFoundException($"Offer with ID {request.OfferId} not found.");

        var authResult = await _authorizationService.AuthorizeAsync(user, offer, "OfferOwnerPolicy");
        if (!authResult.Succeeded)
            throw new UnauthorizedAccessException("You are not authorized to update this offer.");

        if (offer.OfferTypeId != request.OfferData.OfferTypeId)
        {
            if (!await _unitOfWork.Offers.OfferTypeExistsAsync(request.OfferData.OfferTypeId))
                throw new InvalidOperationException($"Offer type with ID {request.OfferData.OfferTypeId} does not exist");
        }
        
        var amenities = await _unitOfWork.Offers.GetAmenitiesByIdsAsync(request.OfferData.AmenityIds);
        
        offer.Title = request.OfferData.Title;
        offer.Description = request.OfferData.Description;
        offer.PricePerNight = request.OfferData.PricePerNight;
        offer.MaxGuests = request.OfferData.MaxGuests;
        offer.Rooms = request.OfferData.Rooms;
        offer.SingleBeds = request.OfferData.SingleBeds;
        offer.DoubleBeds = request.OfferData.DoubleBeds;
        offer.Sofas = request.OfferData.Sofas;
        offer.Bathrooms = request.OfferData.Bathrooms;
        offer.AddressStreet = request.OfferData.AddressStreet;
        offer.AddressCity = request.OfferData.AddressCity;
        offer.AddressZipCode = request.OfferData.AddressZipCode;
        offer.AddressCountry = request.OfferData.AddressCountry;
        offer.AddressLatitude = request.OfferData.AddressLatitude;
        offer.AddressLongitude = request.OfferData.AddressLongitude;
        offer.OfferTypeId = request.OfferData.OfferTypeId;

        offer.Amenities.Clear();
        foreach (var amenity in amenities)
        {
            offer.Amenities.Add(amenity);
        }

        await _unitOfWork.Offers.UpdateAsync(offer); 
        await _unitOfWork.SaveChangesAsync(ct);

        return _mapper.Map<OfferDto>(offer);
    }
}