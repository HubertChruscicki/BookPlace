using Application.Authorization.Requirements;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user can view offer details.
/// Used for viewing offers with different access levels (public vs private).
/// Public access: offer.Status == Active. Private access: offer.HostId == currentUserId (all statuses).
/// </summary>
public class OfferViewAuthorizationHandler : AuthorizationHandler<OfferViewRequirement, Offer>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OfferViewRequirement requirement,
        Offer resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (resource.Status == OfferStatus.Active)
        {
            context.Succeed(requirement);
        }
        else if (userId != null && resource.HostId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
