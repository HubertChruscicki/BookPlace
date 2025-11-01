using Domain.Entities;

public class OfferPhoto
{
    public int Id { get; set; }
    public int OfferId { get; set; }
    public string OriginalUrl { get; set; } = String.Empty;
    public string MediumUrl { get; set; } = String.Empty;
    public string ThumbnailUrl { get; set; } = String.Empty;
    public bool IsCover { get; set; }
    public int SortOrder { get; set; }

    public Offer Offer { get; set; } = null!;
}
