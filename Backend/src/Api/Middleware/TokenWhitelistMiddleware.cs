using System.IdentityModel.Tokens.Jwt;
using Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Api.Middleware;

/// <summary>
/// Middleware that validates JWT tokens against a whitelist of active tokens.
/// Only tokens present in the ActiveTokens table are considered valid.
/// </summary>
public class TokenWhitelistMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TokenWhitelistMiddleware> _logger;

    public TokenWhitelistMiddleware(RequestDelegate next, ILogger<TokenWhitelistMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Validates incoming JWT tokens against the whitelist database.
    /// Rejects requests with tokens that are NOT in the ActiveTokens table.
    /// </summary>
    /// <param name="context">HTTP context containing the request</param>
    /// <param name="dbContext">Database context for checking whitelisted tokens</param>
    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        var token = context.Request.Cookies["access_token"];      
        
        if (string.IsNullOrEmpty(token))
        {
            await _next(context);
            return;
        }
        
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jsonToken = tokenHandler.ReadJwtToken(token);
            
            var jti = jsonToken.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
            
            if (!string.IsNullOrEmpty(jti))
            {
                var isWhitelisted = await dbContext.ActiveTokens
                    .AnyAsync(at => at.Jti == jti && at.ExpiresAt > DateTime.UtcNow);

                if (!isWhitelisted)
                {
                    _logger.LogWarning("Attempted use of non-whitelisted token with JTI: {Jti}", jti);
                    
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token is not active");
                    return;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error validating token against whitelist");
        }

        await _next(context);
    }
}
