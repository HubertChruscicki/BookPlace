using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is the owner of a booking.
/// Used for booking management actions by guests (cancel, modify reservations).
/// Verifies that booking.GuestId matches the current user's ID.
/// </summary>
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
