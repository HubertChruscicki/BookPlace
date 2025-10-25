using Microsoft.AspNetCore.Authorization;
namespace Application.Authorization.Requirements;

/// <summary>
/// Authorization requirement to verify if the current user is the owner of a review.
/// Used for editing and deleting reviews.
/// Logic: review.GuestId == currentUserId
/// </summary>
public class ReviewOwnerRequirement : IAuthorizationRequirement
{
}
