using Application.DTOs.Offers;
using Domain.Enums;
using MediatR;

namespace Application.Features.Offers.Commands.UpdateStatus;

/// <summary>
/// Command to update the status of an existing offer
/// </summary>
public class UpdateOfferStatusCommand : IRequest<OfferDto> // Zwrócimy zaktualizowaną ofertę
{
    public int OfferId { get; set; } 
    public OfferStatus NewStatus { get; set; } 
}