using Application.DTOs.Offers;
using MediatR;

namespace Application.Features.Offers.Commands;

/// <summary>
/// Command for creating a new offer
/// </summary>
public class CreateOfferCommand : IRequest<CreateOfferResponseDto>
{
    public string UserId { get; set; } = string.Empty;
    public CreateOfferDto OfferData { get; set; } = null!;
}
