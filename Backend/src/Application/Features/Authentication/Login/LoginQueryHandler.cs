using Application.DTOs.Auth;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Features.Authentication.Login;

/// <summary>
/// Handles user login authentication by validating credentials and generating JWT tokens.
/// </summary>
public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponse>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtService _jwtService;
    private readonly ILogger<LoginQueryHandler> _logger;

    public LoginQueryHandler(
        UserManager<User> userManager,
        IJwtService jwtService,
        ILogger<LoginQueryHandler> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _logger = logger;
    }

    /// <summary>
    /// Authenticates user credentials and generates JWT tokens for valid login attempts.
    /// </summary>
    /// <param name="request">Login query containing email and password</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Authentication response with JWT tokens and user information</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when credentials are invalid</exception>
    public async Task<AuthResponse> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken(user);

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
