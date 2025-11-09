using MediatR;

namespace Application.Features.Offers.Commands.DeleteOffer;

/// <summary>
/// Command to soft-delete (archive) an offer
/// </summary>
public class DeleteOfferCommand : IRequest
{
    public int OfferId { get; set; } 
}