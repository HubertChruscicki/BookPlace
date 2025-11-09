using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is the owner of a review.
/// Used for editing and deleting reviews.
/// Verifies that review.GuestId matches the current user's ID.
/// </summary>
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

        if (resource.GuestId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
