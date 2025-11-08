using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Register;

/// <summary>
/// Command for registering a new user account with Guest role
/// </summary>
public class RegisterCommand : IRequest<AuthResponse>
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
