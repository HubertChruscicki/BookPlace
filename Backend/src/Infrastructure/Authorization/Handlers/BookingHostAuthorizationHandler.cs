using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

public class BookingHostAuthorizationHandler : AuthorizationHandler<BookingHostRequirement, Booking>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        BookingHostRequirement requirement,
        Booking resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null)
        {
            return Task.CompletedTask;
        }

        // Logic: booking.Offer.HostId == currentUserId
        if (resource.Offer?.HostId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
