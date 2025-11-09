using Application.DTOs.Offers;
using MediatR;


namespace Application.Features.Offers.Queries.GetOfferTypes;

/// <summary>
/// Query to get all available offer types
/// </summary>
public class GetOfferTypesQuery : IRequest<List<OfferTypeDto>>
{
}
