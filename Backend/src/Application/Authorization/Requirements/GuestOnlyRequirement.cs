using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify that the current user has Guest role and is eligible for promotion to Host.
/// Used for role promotion endpoints to prevent Hosts from being promoted again.
/// </summary>
public class GuestOnlyRequirement : IAuthorizationRequirement
{
}
