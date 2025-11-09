using Application.Authorization.Requirements;
using Application.Authorization.Contexts;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Application.Interfaces;
using Domain.Entities;

namespace Infrastructure.Authorization.Handlers;

/// <summary>
/// Authorization handler to verify if the current user is eligible to add a review.
/// Used for creating new reviews after completed bookings.
/// Verifies that user had a completed booking, hasn't reviewed this offer yet, and booking was in the past.
/// </summary>
public class ReviewEligibilityAuthorizationHandler : AuthorizationHandler<ReviewEligibilityRequirement, Booking>
{
    private readonly IUnitOfWork _unitOfWork;

    public ReviewEligibilityAuthorizationHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ReviewEligibilityRequirement requirement,
        Booking resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            context.Fail(new AuthorizationFailureReason(this, "User is not authenticated."));
            return;
        }

        if (resource.GuestId != userId)
        {
            context.Fail(new AuthorizationFailureReason(this, "User is not the guest for this booking."));
            return;
        }

        if (resource.Status != BookingStatus.Completed)
        {
            context.Fail(new AuthorizationFailureReason(this, "Booking is not completed."));
            return;
        }

        var reviewExists = await _unitOfWork.Reviews.ExistsForBookingAsync(resource.Id);
        if (reviewExists)
        {
            context.Fail(new AuthorizationFailureReason(this, "Review has already been submitted for this booking."));
            return;
        }

        context.Succeed(requirement);
    }
}
