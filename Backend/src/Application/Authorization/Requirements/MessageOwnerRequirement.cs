using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is the owner of a message.
/// Used for editing and deleting messages.
/// Logic: message.SenderId == currentUserId
/// </summary>
public class MessageOwnerRequirement : IAuthorizationRequirement
{
}
