using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user can initiate a conversation.
/// Used for starting new conversations about offers or reviews.
/// Logic: For offers - currentUserId != offer.HostId (guest can write to host), For reviews - currentUserId != review.GuestId (review author can respond)
/// </summary>
public class ConversationInitiatorRequirement : IAuthorizationRequirement
{
}
