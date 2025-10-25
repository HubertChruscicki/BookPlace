using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is a participant in a conversation.
/// Used for sending messages and reading conversation history.
/// Logic: conversation.Participants.Any(p => p.Id == currentUserId)
/// </summary>
public class ConversationParticipantRequirement : IAuthorizationRequirement
{
}
