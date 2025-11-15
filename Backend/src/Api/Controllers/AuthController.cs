using Application.DTOs.Auth;
using Application.Features.Authentication.Register;
using Application.Features.Authentication.Login;
using Application.Features.Authentication.Refresh;
using Application.Features.Authentication.PromoteToHost;
using Application.Features.Authentication.GetCurrentUser;
using Application.Features.Authentication.Logout;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;

/// <summary>
/// Provides authentication and authorization endpoints for the BookPlace application.
/// Handles user registration, login, token refresh, role promotion, and user profile management.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    /// <summary>
    /// Sets HttpOnly cookies for access and refresh tokens
    /// </summary>
    private void SetAuthCookies(string accessToken, string refreshToken)
    {
        var accessCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth/refresh",
            Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("access_token", accessToken, accessCookieOptions);
        Response.Cookies.Append("refresh_token", refreshToken, refreshCookieOptions);
    }

    /// <summary>
    /// Clears authentication cookies by setting them to expire in the past
    /// </summary>
    private void ClearAuthCookies()
    {
        var accessCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(-1)
        };

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth/refresh",
            Expires = DateTime.UtcNow.AddDays(-1)
        };

        Response.Cookies.Append("access_token", "", accessCookieOptions);
        Response.Cookies.Append("refresh_token", "", refreshCookieOptions);
    }

    /// <summary>
    /// Registers a new user account in the system.
    /// </summary>
    /// <param name="request">User registration data including name, email, password, and password confirmation</param>
    /// <returns>Authentication response with JWT tokens and user information</returns>
    /// <response code="200">User successfully registered with authentication tokens</response>
    /// <response code="400">Invalid registration data or user already exists</response>
    /// <response code="500">Internal server error during registration</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var command = new RegisterCommand
        {
            Email = request.Email,
            Password = request.Password,
            Name = request.Name,
            Surname = request.Surname,
            Phone = request.Phone
        };

        var response = await _mediator.Send(command);
        SetAuthCookies(response.AccessToken, response.RefreshToken);
        return Ok(new AuthResponse
        {
            ExpiresAt = response.ExpiresAt,
            User = response.User
        });    
    }

    /// <summary>
    /// Authenticates a user with email and password credentials.
    /// </summary>
    /// <param name="request">Login credentials containing email and password</param>
    /// <returns>Authentication response with JWT tokens and user information</returns>
    /// <response code="200">User successfully authenticated with tokens</response>
    /// <response code="401">Invalid email or password credentials</response>
    /// <response code="500">Internal server error during authentication</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var query = new LoginQuery 
        { 
            Email = request.Email, 
            Password = request.Password 
        };
        var response = await _mediator.Send(query);
        SetAuthCookies(response.AccessToken, response.RefreshToken);
        return Ok(new AuthResponse
        {
            ExpiresAt = response.ExpiresAt,
            User = response.User
        });    
    }

    /// <summary>
    /// Refreshes an expired access token using a valid refresh token.
    /// </summary>
    /// <returns>New authentication response with fresh JWT tokens</returns>
    /// <response code="200">Tokens successfully refreshed</response>
    /// <response code="401">Invalid or expired refresh token</response>
    /// <response code="500">Internal server error during token refresh</response>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<AuthResponse>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            ClearAuthCookies();
            return Unauthorized("Refresh token not found");
        }

        var command = new RefreshTokenCommand { RefreshToken = refreshToken };
        var response = await _mediator.Send(command);
        
        SetAuthCookies(response.AccessToken, response.RefreshToken);
        
        return Ok(new AuthResponse
        {
            ExpiresAt = response.ExpiresAt,
            User = response.User
        });
    }

    /// <summary>
    /// Promotes an authenticated user from Guest role to Host role.
    /// Allows users to become property hosts and create accommodation offers.
    /// </summary>
    /// <returns>Authentication response with updated user roles and new tokens</returns>
    /// <response code="200">User successfully promoted to Host role</response>
    /// <response code="400">User is already a Host or promotion failed</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="500">Internal server error during role promotion</response>
    [HttpPost("promote-to-host")]
    [Authorize(Policy = "GuestOnlyPolicy")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<AuthResponse>> PromoteToHost()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        
        var command = new PromoteToHostCommand { UserId = userId };
        var response = await _mediator.Send(command);
        
        SetAuthCookies(response.AccessToken, response.RefreshToken);

        return Ok(new AuthResponse
        {
            ExpiresAt = response.ExpiresAt,
            User = response.User
        });
    }

    /// <summary>
    /// Retrieves detailed information about the currently authenticated user.
    /// </summary>
    /// <returns>Current user's profile information and assigned roles</returns>
    /// <response code="200">User information successfully retrieved</response>
    /// <response code="401">User not authenticated</response>
    /// <response code="404">User account not found</response>
    /// <response code="500">Internal server error retrieving user data</response>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfo), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<UserInfo>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        
        var query = new GetCurrentUserQuery { UserId = userId };
        var userInfo = await _mediator.Send(query);
        return Ok(userInfo);
    }

    /// <summary>
    /// Logs out the current user by invalidating their JWT tokens.
    /// Retrieves tokens from HTTP cookies and adds them to blacklist to prevent reuse.
    /// Clears authentication cookies from the browser.
    /// </summary>
    /// <returns>Confirmation message of successful logout with invalidation details</returns>
    /// <response code="200">User successfully logged out with tokens invalidated</response>
    /// <response code="400">Invalid tokens provided</response>
    /// <response code="401">User not authenticated or tokens belong to different user</response>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(LogoutResponse), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<ActionResult<LogoutResponse>> Logout()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var accessToken = Request.Cookies["access_token"];
        var refreshToken = Request.Cookies["refresh_token"];
        
        if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
        {
            var command = new LogoutCommand 
            { 
                UserId = userId,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
            
            await _mediator.Send(command);
        }
        
        ClearAuthCookies();
        return Ok(new LogoutResponse {});
    }
}
