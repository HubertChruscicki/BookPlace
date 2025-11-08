using MediatR;

namespace Application.Features.Bookings.Queries.GetBusyDates;

/// <summary>
/// Query to get busy dates for a specific offer in a given month and year
/// </summary>
public class GetOfferBusyDatesQuery : IRequest<List<string>>
{
    public int OfferId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
}
