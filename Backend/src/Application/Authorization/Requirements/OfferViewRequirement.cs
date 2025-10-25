using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user can view offer details.
/// Used for viewing offers with different access levels (public vs private).
/// Logic: Public - offer.Status == Active, Private - offer.HostId == currentUserId (all statuses)
/// </summary>
public class OfferViewRequirement : IAuthorizationRequirement
{
}
