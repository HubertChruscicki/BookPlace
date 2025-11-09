using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is the host of the offer associated with a booking.
/// Used for booking management actions by hosts (accept/reject reservations).
/// Verifies that booking.Offer.HostId matches the current user's ID.
/// </summary>
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

        if (resource.Offer?.HostId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
