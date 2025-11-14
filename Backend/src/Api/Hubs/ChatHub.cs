using Application.Features.Messages.Commands.SendMessage;
using Application.DTOs.Messages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Application.DTOs.Conversations;

namespace Api.Hubs;

/// <summary>
/// SignalR Hub for real-time chat functionality
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    private readonly IMediator _mediator;
    private readonly IAuthorizationService _authorizationService;
    
    public ChatHub(IMediator mediator, IAuthorizationService authorizationService)
    {
        _mediator = mediator;
        _authorizationService = authorizationService;
    }
    
    /// <summary>
    /// Invoked when a new connection is established to the ChatHub
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;

        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Invoked when a connection to the ChatHub is terminated
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Joins a conversation group for real-time message updates
    /// </summary>
    /// <param name="conversationId">ID of the conversation to join</param>
    public async Task JoinConversation(string conversationId)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }

        // TODO: Add authorization check if user can access this conversation
        await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        
        await Clients.Caller.SendAsync("JoinedConversation", conversationId);
    }

    /// <summary>
    /// Leaves a conversation group
    /// </summary>
    /// <param name="conversationId">ID of the conversation to leave</param>
    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        
        await Clients.Caller.SendAsync("LeftConversation", conversationId);
    }

    /// <summary>
    /// Sends a message through SignalR (alternative to HTTP endpoint)
    /// </summary>
    /// <param name="conversationId">ID of the conversation</param>
    /// <param name="content">Message content</param>
    public async Task SendMessage(int conversationId, string content)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }

        try
        {
            var command = new SendMessageCommand
            {
                ConversationId = conversationId,
                SenderId = userId,
                Content = content,
                Photos = new List<MessagePhotoRequestDto>()
                //TODO  No photos via SignalR for now
            };

            var result = await _mediator.Send(command);
            
            await Clients.Caller.SendAsync("MessageSent", result);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("MessageError", ex.Message);
        }
    }

    /// <summary>
    /// Marks messages as read
    /// </summary>
    /// <param name="conversationId">ID of the conversation</param>
    public async Task MarkMessagesAsRead(int conversationId)
    {
        var userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }

        // TODO: Implement mark as read functionality
        // This would require additional command/handler
        await Clients.Caller.SendAsync("MessagesMarkedAsRead", conversationId);
    }
}