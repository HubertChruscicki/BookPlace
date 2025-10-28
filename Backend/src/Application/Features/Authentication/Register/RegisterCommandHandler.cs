using Application.DTOs.Auth;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Features.Authentication.Register;

/// <summary>
/// Handler for processing user registration commands.
/// Creates new user account, assigns Guest role, and generates authentication tokens.
/// </summary>
public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtService _jwtService;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        UserManager<User> userManager,
        IJwtService jwtService,
        ILogger<RegisterCommandHandler> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _logger = logger;
    }

    /// <summary>
    /// Handles user registration process including validation, user creation, role assignment, and token generation.
    /// </summary>
    /// <param name="request">Registration command containing user details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Authentication response with JWT tokens and user information</returns>
    /// <exception cref="InvalidOperationException">Thrown when user already exists or registration fails</exception>
    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        // Create new user
        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.Name,
            Surname = request.Surname,
            PhoneNumber = request.Phone
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create user: {errors}");
        }

        // Assign Guest role by default
        await _userManager.AddToRoleAsync(user, "Guest");

        // Generate tokens
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken(user);

        _logger.LogInformation("User {Email} registered successfully", request.Email);

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
                Roles = roles.ToList()
            }
        };
    }
}
