using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is the host of the offer associated with a booking.
/// Used for booking management actions by hosts (accept/reject reservations).
/// Logic: booking.Offer.HostId == currentUserId
/// </summary>
public class BookingHostRequirement : IAuthorizationRequirement
{
}
