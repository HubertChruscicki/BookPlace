using Application.Authorization.Requirements;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler for Host role requirement
/// </summary>
public class HostRoleAuthorizationHandler : AuthorizationHandler<HostRoleRequirement>
{
    /// <summary>
    /// Handles the Host role authorization requirement
    /// </summary>
    /// <param name="context">Authorization context</param>
    /// <param name="requirement">Host role requirement</param>
    /// <returns>Task representing the async operation</returns>
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        HostRoleRequirement requirement)
    {
        // Check if user has Host role
        if (context.User.IsInRole("Host"))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
