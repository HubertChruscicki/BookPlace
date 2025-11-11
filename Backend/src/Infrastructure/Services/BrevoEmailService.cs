using Application.Interfaces;
using brevo_csharp.Api;
using brevo_csharp.Model;
using Domain.Enums;
using Infrastructure.Configs;
using Microsoft.Extensions.Options;
using Configuration = brevo_csharp.Client.Configuration;
using Task = System.Threading.Tasks.Task;

namespace Infrastructure.Services;

public class BrevoEmailService : IEmailService
{
    private readonly BrevoSettings _settings;

    public BrevoEmailService(IOptions<BrevoSettings> settings)
    {
        _settings = settings.Value;
        if (!Configuration.Default.ApiKey.ContainsKey("api-key"))
        {
            Configuration.Default.AddApiKey("api-key", _settings.ApiKey);
        }
    }

    public async Task SendTemplateEmailAsync(
        string email,
        EmailTemplate template,
        object parameters,
        CancellationToken cancellationToken = default
    )
    {
        var apiInstance = new TransactionalEmailsApi();
        var sendSmtpEmail = new SendSmtpEmail
        {
            To = new List<SendSmtpEmailTo> { 
                new SendSmtpEmailTo(email) 
            },
            TemplateId = (long)template,
            Params = parameters 
        };
        cancellationToken.ThrowIfCancellationRequested();
        await apiInstance.SendTransacEmailAsync(sendSmtpEmail);
    }
}
