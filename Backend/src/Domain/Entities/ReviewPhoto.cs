namespace Domain.Entities;

public class ReviewPhoto
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public string Url { get; set; } = string.Empty;
    
    public Review Review { get; set; } = null!;
}
