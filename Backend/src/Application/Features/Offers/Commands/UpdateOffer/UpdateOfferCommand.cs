using Application.DTOs.Bookings;
using Application.DTOs.Offers;
using MediatR;

namespace Application.Features.Offers.Commands.UpdateOffer;

/// <summary>
/// Command to update an existing offer
/// </summary>
public class UpdateOfferCommand : IRequest<OfferDto>
{
    public int OfferId { get; set; } 
    public UpdateOfferRequestDto OfferData { get; set; } = null!;
}