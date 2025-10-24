using Domain.Entities;
public class OfferType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}