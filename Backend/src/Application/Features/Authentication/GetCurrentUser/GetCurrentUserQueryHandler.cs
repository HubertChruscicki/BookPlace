using Application.DTOs.Auth;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Authentication.GetCurrentUser;

/// <summary>
/// Handles retrieval of detailed profile information for the current authenticated user.
/// </summary>
public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserInfo>
{
    private readonly UserManager<User> _userManager;

    public GetCurrentUserQueryHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    /// <summary>
    /// Retrieves detailed profile information for the specified user.
    /// </summary>
    /// <param name="request">Query containing the user ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User profile information including roles</returns>
    /// <exception cref="ArgumentException">Thrown when userId is null or empty</exception>
    /// <exception cref="InvalidOperationException">Thrown when user not found</exception>
    public async Task<UserInfo> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            throw new ArgumentException("User ID cannot be null or empty");
        }

        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var roles = await _userManager.GetRolesAsync(user);

        return new UserInfo
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Phone = user.PhoneNumber ?? string.Empty,
            Email = user.Email ?? string.Empty,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Roles = roles.ToList()
        };
    }
}
