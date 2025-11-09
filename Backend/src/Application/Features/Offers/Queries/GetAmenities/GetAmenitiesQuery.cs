using Application.DTOs.Offers;
using MediatR;

namespace Application.Features.Offers.Queries.GetAmenities;

/// <summary>
/// Query to get all available amenities
/// </summary>
public class GetAmenitiesQuery : IRequest<List<AmenityDto>>
{
}
