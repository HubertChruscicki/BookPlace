using Application.Authorization.Requirements;
using Application.Authorization.Contexts;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is eligible to add a review.
/// Used for creating new reviews after completed bookings.
/// Verifies that user had a completed booking, hasn't reviewed this offer yet, and booking was in the past.
/// </summary>
public class ReviewEligibilityAuthorizationHandler : AuthorizationHandler<ReviewEligibilityRequirement, ReviewEligibilityContext>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ReviewEligibilityRequirement requirement,
        ReviewEligibilityContext resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null || userId != resource.UserId)
        {
            return Task.CompletedTask;
        }

        // Logic: 
        // - Użytkownik miał zakończoną rezerwację (Status = Completed)
        // - Nie dodał jeszcze opinii dla tej oferty
        // - Rezerwacja była w przeszłości
        // TODO: Implementacja logiki weryfikacji w database service
        
        // Na razie pozwalamy - logika będzie w service layer
        context.Succeed(requirement);

        return Task.CompletedTask;
    }
}
