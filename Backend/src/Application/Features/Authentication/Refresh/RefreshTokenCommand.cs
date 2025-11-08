using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Refresh;

/// <summary>
/// Command to refresh JWT tokens using a valid refresh token
/// </summary>
public class RefreshTokenCommand : IRequest<AuthResponse>
{
    public string RefreshToken { get; set; } = string.Empty;
}
