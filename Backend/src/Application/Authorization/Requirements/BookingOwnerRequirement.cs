using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is the owner of a booking.
/// Used for booking management actions by guests (cancel, modify reservations).
/// Logic: booking.GuestId == currentUserId
/// </summary>
public class BookingOwnerRequirement : IAuthorizationRequirement
{
}
