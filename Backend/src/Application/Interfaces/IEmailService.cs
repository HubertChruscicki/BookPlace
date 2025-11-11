using Domain.Enums;

namespace Application.Interfaces;

public interface IEmailService
{
    Task SendTemplateEmailAsync(
        string email,
        EmailTemplate template, 
        object parameters, 
        CancellationToken cancellationToken = default);
}