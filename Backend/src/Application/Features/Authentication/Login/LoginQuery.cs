using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Login;

/// <summary>
/// Query for user login authentication that validates credentials and generates JWT tokens
/// </summary>
public class LoginQuery : IRequest<AuthResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
