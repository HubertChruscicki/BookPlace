using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Logout;

/// <summary>
/// Command to logout a user by invalidating their JWT tokens.
/// Adds both access and refresh tokens to blacklist to prevent reuse.
/// </summary>
public class LogoutCommand : LogoutRequest, IRequest<LogoutResponse>
{
    public string UserId { get; set; } = string.Empty;
}
