using Application.Authorization.Requirements;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Infrastructure.Authorization.Handlers;

public class BookingParticipantAuthorizationHandler : AuthorizationHandler<BookingParticipantRequirement, Booking>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        BookingParticipantRequirement requirement,
        Booking resource)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId == null)
        {
            return Task.CompletedTask;
        }

        // Logic: booking.GuestId == currentUserId || booking.Offer.HostId == currentUserId
        if (resource.GuestId == userId || resource.Offer?.HostId == userId)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
