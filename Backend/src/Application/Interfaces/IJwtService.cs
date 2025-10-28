using System.Security.Claims;
using Domain.Entities;

namespace Application.Interfaces;

/// <summary>
/// Service for JWT token management including access and refresh token generation and validation.
/// Handles token creation, expiration, and principal extraction for authentication and authorization.
/// </summary>
public interface IJwtService
{
    /// <summary>
    /// Generates a short-lived access token (15 minutes) for API authentication.
    /// Contains user claims: sub, email, given_name, family_name, mobile_phone, roles, jti, iat.
    /// </summary>
    /// <param name="user">User entity containing ID, email, name, surname, and phone</param>
    /// <param name="roles">List of user roles (Guest, Host)</param>
    /// <returns>JWT access token string</returns>
    string GenerateAccessToken(User user, IList<string> roles);
    
    /// <summary>
    /// Generates a long-lived refresh token (7 days) for token renewal.
    /// Contains minimal claims: sub, jti, token_type=refresh.
    /// </summary>
    /// <param name="user">User entity containing ID</param>
    /// <returns>JWT refresh token string</returns>
    string GenerateRefreshToken(User user);
    
    /// <summary>
    /// Extracts claims principal from an expired token for refresh token validation.
    /// Used to validate refresh tokens and extract user information for new token generation.
    /// </summary>
    /// <param name="token">Expired JWT token string</param>
    /// <returns>Claims principal if token is valid (ignoring expiration), null if invalid</returns>
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
