using Domain.Entities;

public class OfferPhoto
{
    public int Id { get; set; }
    public int OfferId { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsCover { get; set; }
    public int SortOrder { get; set; }
    
    public Offer Offer { get; set; } = null!;
}