using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement for Host role access
/// </summary>
public class HostRoleRequirement : IAuthorizationRequirement
{
    // Empty marker class - logic is implemented in the handler
}
