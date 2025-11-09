using Application.DTOs.Offers;
using Application.DTOs.Bookings;
using Application.Features.Offers.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Application.Common.Pagination;
using Application.Features.Bookings.Queries.GetBusyDates;
using Application.Features.Offers.Commands.DeleteOffer;
using Application.Features.Offers.Commands.UpdateOffer;
using Application.Features.Offers.Commands.UpdateStatus;
using Application.Features.Offers.Queries.GetOffers;
using Application.Features.Offers.Queries.GetOfferById;
using Application.Features.Offers.Queries.GetOfferTypes;
using Application.Features.Offers.Queries.GetAmenities;
using Application.Features.Offers.Queries.GetMyOffers;

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
            MaxPrice = request.MaxPrice,
            CheckInDate = request.CheckInDate,
            CheckOutDate = request.CheckOutDate
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    /// <summary>
    /// Retrieves a paginated list of offers for the authenticated Host
    /// </summary>
    /// <remarks>
    /// Allows filtering by Status and IncludeArchived (default: false)
    /// </remarks>
    [HttpGet("my-offers")]
    [Authorize(Policy = "HostOnlyPolicy")]
    [ProducesResponseType(typeof(PageResult<OfferSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)] 
    public async Task<ActionResult<PageResult<OfferSummaryDto>>> GetMyOffers(
        [FromQuery] GetMyOffersRequestDto requestDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var query = new GetMyOffersQuery
        {
            UserId = userId,
            PageNumber = requestDto.PageNumber,
            PageSize = requestDto.PageSize,
            Status = requestDto.Status,
            IncludeArchived = requestDto.IncludeArchived
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a specific offer by ID with full details
    /// </summary>
    /// <param name="id">Offer ID</param>
    /// <returns>Complete offer details with all photos and amenities</returns>
    /// <response code="200">Offer details retrieved successfully</response>
    /// <response code="404">Offer not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOfferById(int id)
    {
        var query = new GetOfferByIdQuery { OfferId = id };
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
    
    /// <summary>
    /// Updates an existing offer
    /// </summary>
    /// <remarks>User must be the owner of the offer (OfferOwnerPolicy)</remarks>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(OfferDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OfferDto>> UpdateOffer(
        [FromRoute] int id, 
        [FromBody] UpdateOfferRequestDto requestDto)
    {
        var command = new UpdateOfferCommand
        {
            OfferId = id,
            OfferData = requestDto
        };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Archives an offer (Soft Delete)
    /// </summary>
    /// <remarks>User must be the owner of the offer (OfferOwnerPolicy)</remarks>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteOffer([FromRoute] int id)
    {
        var command = new DeleteOfferCommand { OfferId = id };
        await _mediator.Send(command);
        return NoContent();
    }
    
    /// <summary>
    /// Updates the status of a specific offer
    /// </summary>
    /// <remarks>User must be the owner of the offer (OfferOwnerPolicy)</remarks>
    [HttpPatch("{id}/status")]
    [Authorize]
    [ProducesResponseType(typeof(OfferDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)] 
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OfferDto>> UpdateOfferStatus(
        [FromRoute] int id, 
        [FromBody] UpdateOfferStatusRequestDto requestDto)
    {
        var command = new UpdateOfferStatusCommand
        {
            OfferId = id,
            NewStatus = requestDto.NewStatus
        };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Gets all available offer types
    /// </summary>
    /// <returns>List of all offer types</returns>
    /// <response code="200">Offer types retrieved successfully</response>
    [HttpGet("types")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<OfferTypeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOfferTypes()
    {
        var query = new GetOfferTypesQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Gets all available amenities
    /// </summary>
    /// <returns>List of all amenities</returns>
    /// <response code="200">Amenities retrieved successfully</response>
    [HttpGet("amenities")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<AmenityDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAmenities()
    {
        var query = new GetAmenitiesQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}