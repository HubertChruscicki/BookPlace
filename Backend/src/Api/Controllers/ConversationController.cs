using System.Security.Claims;
using Application.DTOs.Messages;
using Application.DTOs.Conversations;
using Application.Features.Conversations.Commands;
using Application.Features.Messages.Commands.SendMessage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Api.Hubs;
using Application.Common.Pagination;
using Application.Features.Conversations;
using Application.Features.Conversations.Queries;
using Application.Features.Messages.Queries;

namespace Api.Controllers;
    
/// <summary>
/// Retrieves and manages user conversations (chats).
/// Logic sending messages is handled in SendMessageCommand and MessageHub.
/// </summary>
[ApiController]
[Route("api/conversations")]
[Authorize]
public class ConversationController : ControllerBase
{
    private readonly IMediator _mediator;

    public ConversationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieves paginated list of all user chats (inbox).
    /// </summary>
    /// <param name="requestDto">Pagination Details.</param>
    /// <returns>Paginated conversations inbox list.</returns>
    [HttpGet]
    public async Task<ActionResult<PageResult<ConversationInboxDto>>> GetConversations(
        [FromQuery] GetConversationsRequestDto requestDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var query = new GetConversationsQuery
        {
            UserId = userId,
            PageNumber = requestDto.PageNumber,
            PageSize = requestDto.PageSize,
            Role = requestDto.Role
        };
        
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves paginated historical messages for a specific conversation.
    /// </summary>
    /// <param name="id">ID of conversation.</param>
    /// <param name="requestDto">Pagination Details.</param>
    /// <returns>Paginated list of messages.</returns>
    [HttpGet("{id}/messages")]
    public async Task<ActionResult<PageResult<MessageDto>>> GetMessages(
        int id, 
        [FromQuery] GetMessagesRequestDto requestDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }

        var query = new GetMessagesQuery
        {
            ConversationId = id,
            UserId = userId, 
            PageNumber = requestDto.PageNumber,
            PageSize = requestDto.PageSize
        };

        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Check if a conversation already exists for BookingId or ReviewId.
    /// </summary>
    /// <param name="requestDto">(BookingId or ReviewId).</param>
    /// <returns>ID of existing conversation or 404 Not Found.</returns>
    [HttpGet("by-context")]
    public async Task<ActionResult<GetConversationByContextResponseDto>> GetConversationByContext(
        [FromQuery] GetConversationByContextRequestDto requestDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized("User ID not found in token");
        }
        
        var query = new GetConversationByContextQuery
        {
            UserId = userId,
            BookingId = requestDto.BookingId,
            ReviewId = requestDto.ReviewId
        };
        
        var result = await _mediator.Send(query);

        if (result == null)
        {
            return NotFound("No conversation found for this context.");
        }

        return Ok(result);
    }
}
