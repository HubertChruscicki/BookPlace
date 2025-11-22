namespace Application.DTOs.Offers;

/// <summary>
/// Represents the publicly exposed host information for an offer.
/// </summary>
public class OfferHostDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}

