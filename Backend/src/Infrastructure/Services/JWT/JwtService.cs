using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services;

/// <summary>
/// Service for JWT token management including access and refresh token generation and validation.
/// Handles token creation, expiration, and principal extraction for authentication and authorization.
/// </summary>
public interface IJwtService
{
    /// <summary>
    /// Generates a short-lived access token (15 minutes) for API authentication.
    /// Contains user claims: sub, email, given_name, roles, jti, iat.
    /// </summary>
    /// <param name="user">User entity containing ID, email, and name</param>
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

/// <summary>
/// JWT service implementation for BookPlace authentication system.
/// Manages access tokens (15 min), refresh tokens (7 days), and token validation.
/// Uses HS256 algorithm with configurable secret key from appsettings.json.
/// </summary>
public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _accessTokenExpirationMinutes;
    private readonly int _refreshTokenExpirationDays;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
        var jwtSettings = _configuration.GetSection("JwtSettings");
        _secretKey = jwtSettings["SecretKey"]!;
        _issuer = jwtSettings["Issuer"]!;
        _audience = jwtSettings["Audience"]!;
        _accessTokenExpirationMinutes = int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!);
        _refreshTokenExpirationDays = int.Parse(jwtSettings["RefreshTokenExpirationDays"]!);
    }

    public string GenerateAccessToken(User user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.GivenName, user.Name ?? ""),
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, 
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), 
                ClaimValueTypes.Integer64)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_accessTokenExpirationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("token_type", "refresh")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_refreshTokenExpirationDays),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey)),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
        
        if (securityToken is not JwtSecurityToken jwtSecurityToken || 
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
}
