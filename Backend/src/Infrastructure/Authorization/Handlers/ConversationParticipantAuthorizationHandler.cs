using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is a participant in a conversation.
/// Used for sending messages and reading conversation history.
/// Verifies that conversation.Participants contains the current user's ID.
/// </summary>
public class ConversationParticipantAuthorizationHandler : AuthorizationHandler<ConversationParticipantRequirement, Conversation>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ConversationParticipantRequirement requirement,
        Conversation resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null)
        {
            return Task.CompletedTask;
        }

        // Logic: conversation.Participants.Any(p => p.Id == currentUserId)
        if (resource.Participants?.Any(p => p.Id == userId) == true)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
