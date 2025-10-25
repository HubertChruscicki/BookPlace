using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

public class ReviewOwnerAuthorizationHandler : AuthorizationHandler<ReviewOwnerRequirement, Review>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ReviewOwnerRequirement requirement,
        Review resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null)
        {
            return Task.CompletedTask;
        }

        // Logic: review.GuestId == currentUserId
        if (resource.GuestId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
