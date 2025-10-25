using Application.Authorization.Requirements;

using Microsoft.AspNetCore.Authorization;
/// Authorization handler to verify that the current user has Guest role only.
/// Prevents users who are already Hosts from being promoted again.
/// Ensures role promotion endpoint is only accessible to Guest users.
/// </summary>
public class GuestOnlyAuthorizationHandler : AuthorizationHandler<GuestOnlyRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        GuestOnlyRequirement requirement)
    {
        // Check if user has Guest role and NOT Host role
        if (context.User.IsInRole("Guest") && !context.User.IsInRole("Host"))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
