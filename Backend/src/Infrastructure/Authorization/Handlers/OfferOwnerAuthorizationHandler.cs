using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

public class OfferOwnerAuthorizationHandler : AuthorizationHandler<OfferOwnerRequirement, Offer>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OfferOwnerRequirement requirement,
        Offer resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null)
        {
            return Task.CompletedTask;
        }

        // Logic: offer.HostId == currentUserId
        if (resource.HostId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
