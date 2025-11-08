using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Logout;

/// <summary>
/// Command to logout a user by invalidating their JWT tokens
/// </summary>
public class LogoutCommand : IRequest<LogoutResponse>
{
    public string UserId { get; set; } = string.Empty;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
