using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is a participant in a booking.
/// Used for accessing booking details by both guests and hosts.
/// Logic: booking.GuestId == currentUserId || booking.Offer.HostId == currentUserId
/// </summary>
public class BookingParticipantRequirement : IAuthorizationRequirement
{
}
