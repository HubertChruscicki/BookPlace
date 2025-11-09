using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is the owner of an offer.
/// Used for editing, deleting, and updating offer status.
/// Verifies that offer.HostId matches the current user's ID.
/// </summary>
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

        if (resource.HostId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
