using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Login;

/// <summary>
/// Query for user login authentication that validates credentials and generates JWT tokens.
/// </summary>
public class LoginQuery : LoginRequest, IRequest<AuthResponse>
{
    // LoginRequest już zawiera Email i Password
}
