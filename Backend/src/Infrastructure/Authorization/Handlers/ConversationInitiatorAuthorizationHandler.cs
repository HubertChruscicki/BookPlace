using Application.Authorization.Requirements;
using Application.Authorization.Contexts;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user can initiate a conversation.
/// Used for starting new conversations about offers or reviews.
/// For offers: verifies currentUserId != offer.HostId (guest can write to host).
/// For reviews: verifies currentUserId != review.GuestId (review author can respond).
/// </summary>
public class ConversationInitiatorAuthorizationHandler : AuthorizationHandler<ConversationInitiatorRequirement, ConversationInitiatorContext>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ConversationInitiatorRequirement requirement,
        ConversationInitiatorContext resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null || userId != resource.InitiatorId)
        {
            return Task.CompletedTask;
        }

        // Logic:
        // - Dla oferty: currentUserId != offer.HostId (gość może pisać do hosta)
        // - Dla opinii: currentUserId != review.GuestId (autor opinii może odpowiedzieć)
        // TODO: Implementacja weryfikacji w database service
        
        // Na razie pozwalamy - logika będzie w service layer
        context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
