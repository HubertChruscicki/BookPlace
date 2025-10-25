using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is the owner of an offer.
/// Used for editing, deleting, and updating offer status.
/// Logic: offer.HostId == currentUserId
/// </summary>
public class OfferOwnerRequirement : IAuthorizationRequirement
{
}
