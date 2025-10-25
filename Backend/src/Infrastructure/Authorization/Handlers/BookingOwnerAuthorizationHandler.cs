using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

public class BookingOwnerAuthorizationHandler : AuthorizationHandler<BookingOwnerRequirement, Booking>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        BookingOwnerRequirement requirement,
        Booking resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null)
        {
            return Task.CompletedTask;
        }

        // Logic: booking.GuestId == currentUserId
        if (resource.GuestId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
