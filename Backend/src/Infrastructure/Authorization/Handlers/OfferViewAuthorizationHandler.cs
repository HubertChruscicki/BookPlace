using Application.Authorization.Requirements;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

public class OfferViewAuthorizationHandler : AuthorizationHandler<OfferViewRequirement, Offer>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OfferViewRequirement requirement,
        Offer resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Logic: 
        // - Publiczne: offer.Status == Active
        // - Prywatne: offer.HostId == currentUserId (wszystkie statusy)
        
        if (resource.Status == OfferStatus.Active)
        {
            // Publiczny dostęp do aktywnych ofert
            context.Succeed(requirement);
        }
        else if (userId != null && resource.HostId == userId)
        {
            // Właściciel może widzieć swoją ofertę w każdym statusie
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
