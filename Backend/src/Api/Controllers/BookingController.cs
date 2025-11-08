using Application.DTOs.Bookings;
using Application.Features.Bookings.Commands.CreateBooking;
using Application.Features.Bookings.Queries.GetPaginatedBookings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Application.Features.Bookings.Commands.CancelBooking;
using Application.Features.Bookings.Queries.GetBookingById;

namespace Api.Controllers;

/// <summary>
/// Controller for managing bookings
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingController : ControllerBase
{
    private readonly IMediator _mediator;

    public BookingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Creates a new booking for the authenticated user
    /// </summary>
    /// <param name="request">Booking creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created booking details</returns>
    /// <response code="201">Booking created successfully</response>
    /// <response code="400">Invalid request data or business rule violation</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="404">Offer not found</response>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto request, CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var command = new CreateBookingCommand
        {
            OfferId = request.OfferId,
            CheckInDate = request.CheckInDate,
            CheckOutDate = request.CheckOutDate,
            NumberOfGuests = request.NumberOfGuests,
            GuestId = userId
        };

        var result = await _mediator.Send(command, cancellationToken);

        return Created("Booking created successfully", result);
    }

    /// <summary>
    /// Retrieves details for a specific booking
    /// </summary>
    /// <param name="id">The ID of the booking to retrieve</param>
    /// <returns>Booking details</returns>
    /// <response code="200">Returns booking details</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="403">User not authorized to view this booking</response>
    /// <response code="404">Booking not found</response>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBookingById([FromRoute] int id)
    {
        var query = new GetBookingByIdQuery { BookingId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a paginated list of bookings for the authenticated user
    /// </summary>
    /// <param name="request">Filtering and pagination parameters</param>
    /// <returns>Paginated list of bookings</returns>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetPaginatedBookings([FromQuery] GetPaginatedBookingsRequestDto request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

        var query = new GetPaginatedBookingsQuery
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Role = request.Role,
            Status = request.Status,
            OfferId = request.OfferId,
            DateFrom = request.DateFrom,
            DateTo = request.DateTo,
            UserId = userId
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    /// <summary>
    /// Cancels a booking (as a Host)
    /// </summary>
    /// <param name="id">The ID of the booking to cancel</param>
    /// <returns>The updated booking details</returns>
    /// <response code="200">Returns updated booking</response>
    /// <response code="400">Invalid operation (e.g., booking already completed)</response>
    /// <response code="403">User is not the host for this booking</response>
    /// <response code="404">Booking not found</response>
    [HttpPatch("{id}/cancel-by-host")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelByHost([FromRoute] int id)
    {
        var command = new CancelBookingByHostCommand { BookingId = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Cancels a booking (as a Guest)
    /// </summary>
    /// <param name="id">The ID of the booking to cancel</param>
    /// <returns>The updated booking details</returns>
    /// <response code="200">Returns updated booking</response>
    /// <response code="400">Invalid operation (e.g., booking already completed)</response>
    /// <response code="403">User is not the guest for this booking</response>
    /// <response code="404">Booking not found</response>
    [HttpPatch("{id}/cancel-by-guest")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelByGuest([FromRoute] int id)
    {
        var command = new CancelBookingByGuestCommand { BookingId = id };
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
