using Application.DTOs.Offers;
using MediatR;

namespace Application.Features.Offers.Queries.GetOfferById;

/// <summary>
/// Query for retrieving a single offer by ID with all details
/// </summary>
public class GetOfferByIdQuery : IRequest<OfferDto>
{
    public int OfferId { get; set; }
}
