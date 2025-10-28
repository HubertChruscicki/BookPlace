using Application.DTOs.Auth;
using MediatR;

namespace Application.Features.Authentication.Register;

/// <summary>
/// Command for registering a new user account with Guest role.
/// Contains all necessary user registration data and returns authentication response.
/// </summary>
public class RegisterCommand : RegisterRequest, IRequest<AuthResponse>
{
    // RegisterRequest już zawiera wszystkie potrzebne pola:
    // Name, Surname, Phone, Email, Password
}
