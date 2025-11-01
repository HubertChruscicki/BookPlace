using System.IdentityModel.Tokens.Jwt;
using Application.DTOs.Auth;
using Application.Interfaces;
using BookPlace.Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
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
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        UserManager<User> userManager,
        IJwtService jwtService,
        IUnitOfWork unitOfWork,
        ILogger<RegisterCommandHandler> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
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

        await _userManager.AddToRoleAsync(user, "Guest");

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken(user);

        var tokenHandler = new JwtSecurityTokenHandler();
        var accessTokenParsed = tokenHandler.ReadJwtToken(accessToken);
        var refreshTokenParsed = tokenHandler.ReadJwtToken(refreshToken);

        var accessTokenJti = accessTokenParsed.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
        var refreshTokenJti = refreshTokenParsed.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;

        if (!string.IsNullOrEmpty(accessTokenJti))
        {
            var accessActiveToken = new ActiveToken
            {
                Jti = accessTokenJti,
                UserId = user.Id,
                TokenType = TokenType.Access,
                ExpiresAt = accessTokenParsed.ValidTo
            };
            await _unitOfWork.ActiveTokens.AddAsync(accessActiveToken);
        }

        if (!string.IsNullOrEmpty(refreshTokenJti))
        {
            var refreshActiveToken = new ActiveToken
            {
                Jti = refreshTokenJti,
                UserId = user.Id,
                TokenType = TokenType.Refresh,
                ExpiresAt = refreshTokenParsed.ValidTo
            };
            await _unitOfWork.ActiveTokens.AddAsync(refreshActiveToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

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
