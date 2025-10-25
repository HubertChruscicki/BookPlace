using Application.DTOs.Auth;
using Application.Interfaces;
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
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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
        var response = await _authService.RegisterAsync(request);
        return Ok(response);
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
        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }

    /// <summary>
    /// Refreshes an expired access token using a valid refresh token.
    /// </summary>
    /// <param name="request">Refresh token request containing the refresh token</param>
    /// <returns>New authentication response with fresh JWT tokens</returns>
    /// <response code="200">Tokens successfully refreshed</response>
    /// <response code="401">Invalid or expired refresh token</response>
    /// <response code="500">Internal server error during token refresh</response>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponse), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<AuthResponse>> RefreshToken(RefreshTokenRequest request)
    {
        var response = await _authService.RefreshTokenAsync(request);
        return Ok(response);
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
        var response = await _authService.PromoteToHostAsync(userId);
        return Ok(response);
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
        var userInfo = await _authService.GetCurrentUserAsync(userId);
        return Ok(userInfo);
    }

    /// <summary>
    /// Logs out the current user by invalidating their session.
    /// In JWT stateless authentication, logout is handled client-side by removing tokens from storage.
    /// </summary>
    /// <returns>Confirmation message of successful logout</returns>
    /// <response code="200">User successfully logged out</response>
    /// <response code="401">User not authenticated</response>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out successfully" });
    }
}
