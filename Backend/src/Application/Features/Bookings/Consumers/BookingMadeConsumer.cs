using Application.Common.Contracts;
using Application.Interfaces;
using Domain.Enums;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Application.Features.Bookings.Consumers;

public class BookingMadeConsumer : IConsumer<BookingMade>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<BookingMadeConsumer> _logger;

    public BookingMadeConsumer(IEmailService emailService, ILogger<BookingMadeConsumer> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<BookingMade> context)
    {
        var message = context.Message;

        _logger.LogInformation(
            "Received BookingMade event for BookingId: {BookingId}",
            message.BookingId
        );
        try
        {
            var emailParameters = new
            {
                first_name = message.RecipientName,
                reservation_id = message.BookingId,
                title = message.OfferTitle,
                city = message.OfferCity,
                country = message.OfferCountry,
                checkin_date = message.CheckInDate.ToString("MMMM dd, yyyy"),
                checkout_date = message.CheckOutDate.ToString("MMMM dd, yyyy"),
            };

            await _emailService.SendTemplateEmailAsync(
                message.RecipientEmail,
                EmailTemplate.BookingMadeTemplate,
                emailParameters,
                context.CancellationToken
            );

            _logger.LogInformation(
                "Sent booking confirmation email to {Email} for BookingId: {BookingId}",
                message.RecipientEmail,
                message.BookingId
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to send booking confirmation email to {Email} for BookingId: {BookingId}",
                message.RecipientEmail,
                message.BookingId
            );
            throw;
        }
    }
}
