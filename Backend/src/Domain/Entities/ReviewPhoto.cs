namespace Domain.Entities;

public class ReviewPhoto
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public string OriginalUrl { get; set; }
    public string ThumbnailUrl { get; set; }
    public Review Review { get; set; } = null!;
}
