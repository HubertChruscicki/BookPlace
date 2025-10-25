using Microsoft.AspNetCore.Authorization;

namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is eligible to add a review.
/// Used for creating new reviews after completed bookings.
/// Logic: User had a completed booking (Status = Completed), hasn't reviewed this offer yet, booking was in the past
/// </summary>
public class ReviewEligibilityRequirement : IAuthorizationRequirement
{
}
