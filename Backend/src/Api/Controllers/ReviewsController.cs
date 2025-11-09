using System.Security.Claims;
using Application.Common.Pagination;
using Application.DTOs.Reviews;
using Application.Features.Reviews.Commands;
using Application.Features.Reviews.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReviewsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a specific review by ID
    /// </summary>
    /// <param name="id">ID of the review to retrieve</param>
    /// <returns>Review with all details including photos and guest information</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReviewDto>> GetReviewById([FromRoute] int id)
    {
        var query = new GetReviewByIdQuery
        {
            ReviewId = id
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Gets paginated reviews for a specific offer
    /// </summary>
    /// <param name="offerId">ID of the offer to get reviews for</param>
    /// <param name="requestDto">Pagination and sorting parameters</param>
    /// <returns>Paginated list of reviews for the offer</returns>
    [HttpGet("offer/{offerId}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PageResult<ReviewDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PageResult<ReviewDto>>> GetReviewsForOffer(
        [FromRoute] int offerId,
        [FromQuery] GetPaginatedReviewsForOfferRequestDto requestDto)
    {
        var query = new GetReviewsForOfferQuery
        {
            OfferId = offerId,
            OrderBy = requestDto.OrderBy,
            OrderDescending = requestDto.OrderDescending,
            PageNumber = requestDto.PageNumber,
            PageSize = requestDto.PageSize
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Gets paginated reviews written by a specific user
    /// </summary>
    /// <param name="userId">ID of the user to get reviews for</param>
    /// <param name="requestDto">Pagination and sorting parameters</param>
    /// <returns>Paginated list of reviews written by the user</returns>
    [HttpGet("user/{userId}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(PageResult<ReviewDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PageResult<ReviewDto>>> GetReviewsByUser(
        [FromRoute] string userId,
        [FromQuery] GetPaginatedReviewsByUserRequestDto requestDto)
    {
        var query = new GetReviewsByUserQuery
        {
            UserId = userId,
            OrderBy = requestDto.OrderBy,
            OrderDescending = requestDto.OrderDescending,
            PageNumber = requestDto.PageNumber,
            PageSize = requestDto.PageSize
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new review for a completed booking
    /// </summary>
    /// <remarks>
    /// User must be the author of the booking (Guest), booking must have 'Completed' status
    /// </remarks>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewRequestDto requestDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(); 
        }

        var command = new CreateReviewCommand
        {
            UserId = userId,
            ReviewData = requestDto
        };

        var result = await _mediator.Send(command);

        return Created("Review created", result);
    }

    /// <summary>
    /// Updates an existing review
    /// </summary>
    /// <remarks>
    /// User must be the owner of the review (original author)
    /// </remarks>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReviewDto>> UpdateReview(
        [FromRoute] int id, 
        [FromBody] UpdateReviewRequestDto requestDto)
    {
        var command = new UpdateReviewCommand
        {
            ReviewId = id,
            ReviewData = requestDto
        };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Archives a review (soft delete)
    /// </summary>
    /// <remarks>
    /// User must be the owner of the review (original author). This operation archives the review instead of permanently deleting it.
    /// </remarks>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteReview([FromRoute] int id)
    {
        var command = new DeleteReviewCommand
        {
            ReviewId = id
        };

        await _mediator.Send(command);
        return Ok(new { message = "Review has been archived successfully" });
    }
}
