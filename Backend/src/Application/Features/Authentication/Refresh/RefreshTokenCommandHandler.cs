using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.DTOs.Auth;
using Application.Interfaces;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Features.Authentication.Refresh;

/// <summary>
/// Handles refreshing JWT tokens using a valid refresh token.
/// </summary>
public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RefreshTokenCommandHandler> _logger;

    public RefreshTokenCommandHandler(
        UserManager<User> userManager,
        IJwtService jwtService,
        IUnitOfWork unitOfWork,
        ILogger<RefreshTokenCommandHandler> logger)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Validates refresh token and generates new access and refresh tokens.
    /// </summary>
    /// <param name="request">Command containing the refresh token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Authentication response with new JWT tokens and user information</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when refresh token is invalid, expired, or user not found</exception>
    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var principal = _jwtService.GetPrincipalFromExpiredToken(request.RefreshToken);
        if (principal == null)
        {
            _logger.LogWarning("Attempted token refresh with invalid token.");
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Refresh token validation failed: User ID claim not found.");
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("Refresh token validation failed: User with ID {UserId} not found.", userId);
            throw new UnauthorizedAccessException("User not found");
        }

        var hasEmail = principal.FindFirst(ClaimTypes.Email) != null;
        var hasRoles = principal.FindAll(ClaimTypes.Role).Any();
        var hasJti = principal.FindFirst(JwtRegisteredClaimNames.Jti) != null;

        if (hasEmail || hasRoles || !hasJti)
        {
            _logger.LogWarning(
                "Refresh token validation failed: Token appears to be an access token, not a refresh token for user {UserId}. HasEmail: {HasEmail}, HasRoles: {HasRoles}, HasJti: {HasJti}",
                userId, hasEmail, hasRoles, hasJti);
            throw new UnauthorizedAccessException("Invalid refresh token - appears to be access token");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var newAccessToken = _jwtService.GenerateAccessToken(user, roles);
        var newRefreshToken = _jwtService.GenerateRefreshToken(user);

        var oldRefreshTokenJti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

        var tokenHandler = new JwtSecurityTokenHandler();
        var newAccessTokenParsed = tokenHandler.ReadJwtToken(newAccessToken);
        var newRefreshTokenParsed = tokenHandler.ReadJwtToken(newRefreshToken);

        var newAccessTokenJti = newAccessTokenParsed.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)
            ?.Value;
        var newRefreshTokenJti = newRefreshTokenParsed.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)
            ?.Value;

        if (!string.IsNullOrEmpty(oldRefreshTokenJti))
        {
            await _unitOfWork.ActiveTokens.RemoveByJtisAsync(new List<string> { oldRefreshTokenJti });
        }

        if (!string.IsNullOrEmpty(newAccessTokenJti))
        {
            var accessActiveToken = new ActiveToken
            {
                Jti = newAccessTokenJti,
                UserId = user.Id,
                TokenType = TokenType.Access,
                ExpiresAt = newAccessTokenParsed.ValidTo
            };
            await _unitOfWork.ActiveTokens.AddAsync(accessActiveToken);
        }

        if (!string.IsNullOrEmpty(newRefreshTokenJti))
        {
            var refreshActiveToken = new ActiveToken
            {
                Jti = newRefreshTokenJti,
                UserId = user.Id,
                TokenType = TokenType.Refresh,
                ExpiresAt = newRefreshTokenParsed.ValidTo
            };
            await _unitOfWork.ActiveTokens.AddAsync(refreshActiveToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Token successfully refreshed for user {UserId}.", user.Id);

        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
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
