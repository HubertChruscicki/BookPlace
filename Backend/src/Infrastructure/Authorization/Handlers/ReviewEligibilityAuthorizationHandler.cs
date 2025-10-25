using Application.Authorization.Requirements;
using Application.Authorization.Contexts;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

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
