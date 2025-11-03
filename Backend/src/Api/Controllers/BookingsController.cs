using Application.Features.Bookings.Commands.CreateBooking;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

/// <summary>
/// Controller for managing bookings
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BookingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Creates a new booking for the authenticated user
    /// </summary>
    /// <param name="command">Booking creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created booking details</returns>
    /// <response code="201">Booking created successfully</response>
    /// <response code="400">Invalid request data or business rule violation</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="404">Offer not found</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingCommand command, CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }
        command.GuestId = userId;
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetBookingById), 
            new { id = result.Id }, 
            result);
    }

    /// <summary>
    /// Placeholder for GetBookingById action (to be implemented later)
    /// </summary>
    /// <param name="id">Booking ID</param>
    /// <returns>Booking details</returns>
    [HttpGet("{id}")]
    public IActionResult GetBookingById(int id)
    {
        // Placeholder - będzie implementowane w następnych etapach
        return Ok($"Booking {id} endpoint - to be implemented");
    }
}
