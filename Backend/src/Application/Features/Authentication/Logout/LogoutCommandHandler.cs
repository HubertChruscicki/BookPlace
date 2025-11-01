using System.Security.Claims;
using Application.DTOs.Auth;
using Application.Interfaces;
using BookPlace.Application.Interfaces;
using Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Features.Authentication.Logout;

/// <summary>
/// Handles user logout by removing JWT tokens from whitelist.
/// Ensures that both access and refresh tokens cannot be reused after logout.
/// </summary>
public class LogoutCommandHandler : IRequestHandler<LogoutCommand, LogoutResponse>
{
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LogoutCommandHandler> _logger;

    public LogoutCommandHandler(
        IJwtService jwtService,
        IUnitOfWork unitOfWork,
        ILogger<LogoutCommandHandler> logger)
    {
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Removes user tokens from whitelist to invalidate them.
    /// Extracts JTI claims from tokens and removes them from ActiveTokens table.
    /// </summary>
    /// <param name="request">Logout command containing access and refresh tokens</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Logout response confirming token removal</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when tokens are invalid or belong to different user</exception>
    public async Task<LogoutResponse> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var tokensToRemove = new List<string>();

        try
        {
            var accessTokenPrincipal = _jwtService.GetPrincipalFromExpiredToken(request.AccessToken);
            if (accessTokenPrincipal != null)
            {
                var accessTokenUserId = accessTokenPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var accessTokenJti = accessTokenPrincipal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti)?.Value;

                if (accessTokenUserId == request.UserId && !string.IsNullOrEmpty(accessTokenJti))
                {
                    tokensToRemove.Add(accessTokenJti);
                }
            }

            var refreshTokenPrincipal = _jwtService.GetPrincipalFromExpiredToken(request.RefreshToken);
            if (refreshTokenPrincipal != null)
            {
                var refreshTokenUserId = refreshTokenPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var refreshTokenJti = refreshTokenPrincipal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti)?.Value;

                if (refreshTokenUserId == request.UserId && !string.IsNullOrEmpty(refreshTokenJti))
                {
                    tokensToRemove.Add(refreshTokenJti);
                }
            }

            if (!tokensToRemove.Any())
            {
                _logger.LogWarning("No valid tokens found for logout for user {UserId}", request.UserId);
                throw new UnauthorizedAccessException("No valid tokens provided for logout");
            }

            await _unitOfWork.ActiveTokens.RemoveByJtisAsync(tokensToRemove);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("User {UserId} logged out successfully. {TokenCount} tokens removed from whitelist.", 
                request.UserId, tokensToRemove.Count);

            return new LogoutResponse
            {
                TokensInvalidated = tokensToRemove.Count
            };
        }
        catch (Exception ex) when (!(ex is UnauthorizedAccessException))
        {
            _logger.LogError(ex, "Error during logout for user {UserId}", request.UserId);
            throw new UnauthorizedAccessException("Invalid tokens provided for logout");
        }
    }
}
