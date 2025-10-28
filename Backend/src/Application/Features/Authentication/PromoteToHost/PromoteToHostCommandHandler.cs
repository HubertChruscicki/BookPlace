using Application.DTOs.Auth;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Features.Authentication.PromoteToHost;

/// <summary>
/// Handles the promotion of a Guest user to Host role.
/// </summary>
public class PromoteToHostCommandHandler : IRequestHandler<PromoteToHostCommand, AuthResponse>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtService _jwtService;
    private readonly ILogger<PromoteToHostCommandHandler> _logger;

    public PromoteToHostCommandHandler(
        UserManager<User> userManager,
        IJwtService jwtService,
        ILogger<PromoteToHostCommandHandler> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _logger = logger;
    }

    /// <summary>
    /// Promotes a Guest user to Host role, enabling them to create accommodation offers.
    /// </summary>
    /// <param name="request">Command containing the user ID to promote</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Authentication response with updated roles and new tokens</returns>
    /// <exception cref="ArgumentException">Thrown when userId is null or empty</exception>
    /// <exception cref="InvalidOperationException">Thrown when user not found or already a Host</exception>
    public async Task<AuthResponse> Handle(PromoteToHostCommand request, CancellationToken cancellationToken)
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
        
        // Check if user is already a Host
        if (roles.Contains("Host"))
        {
            throw new InvalidOperationException("User is already a Host");
        }

        // Add Host role
        var result = await _userManager.AddToRoleAsync(user, "Host");
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to promote user to Host: {errors}");
        }

        // Generate new tokens with updated roles
        var updatedRoles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, updatedRoles);
        var refreshToken = _jwtService.GenerateRefreshToken(user);

        _logger.LogInformation("User {UserId} promoted to Host", request.UserId);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            User = new UserInfo
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Phone = user.PhoneNumber ?? string.Empty,
                Email = user.Email ?? string.Empty,
                ProfilePictureUrl = user.ProfilePictureUrl,
                Roles = updatedRoles.ToList()
            }
        };
    }
}
