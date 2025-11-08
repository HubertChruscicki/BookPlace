using Application.DTOs.Offers;
using Application.DTOs.Bookings;
using Application.Features.Offers.Commands;
using Application.Features.Offers.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Application.Features.Bookings.Queries.GetBusyDates;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OfferController : ControllerBase
{
    private readonly IMediator _mediator;

    public OfferController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    /// <summary>
    /// Retrieves a paginated list of offers with filtering options
    /// </summary>
    /// <param name="request">Filtering and pagination parameters</param>
    /// <returns>Paginated list of offers</returns>
    [HttpGet]
    public async Task<IActionResult> GetPaginated([FromQuery] GetPaginatedOffersRequestDto request)
    {
        var query = new GetPaginatedOffersQuery
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            City = request.City,
            MinPrice = request.MinPrice,
            MaxPrice = request.MaxPrice
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new offer (Host only)
    /// </summary>
    /// <param name="request">Offer creation data</param>
    /// <returns>Created offer details</returns>
    [HttpPost]
    [Authorize(Policy = "HostOnly")]
    public async Task<IActionResult> CreateOffer([FromBody] CreateOfferDto request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        
        var command = new CreateOfferCommand 
        { 
            UserId = userId, 
            OfferData = request 
        };
        
        var result = await _mediator.Send(command);
        return Created("Offer successfully created ", result);
    }

    /// <summary>
    /// Gets busy dates for a specific offer in given month and year
    /// </summary>
    /// <param name="offerId">ID of the offer to get busy dates for</param>
    /// <param name="request">Month and year filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of busy dates in format "yyyy-MM-dd"</returns>
    /// <response code="200">Busy dates retrieved successfully</response>
    /// <response code="404">Offer not found</response>
    [HttpGet("{offerId:int}/busy-dates")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOfferBusyDates(int offerId, [FromQuery] GetBusyDatesRequestDto request, CancellationToken cancellationToken = default)
    {
        var query = new GetOfferBusyDatesQuery 
        { 
            OfferId = offerId,
            Month = request.Month,
            Year = request.Year
        };
        
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

}