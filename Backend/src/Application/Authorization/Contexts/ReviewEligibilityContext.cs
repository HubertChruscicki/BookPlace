namespace Application.Authorization.Contexts;

public class ReviewEligibilityContext
{
    public int OfferId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CheckDate { get; set; } // sprawdzenie czy po zakończeniu pobytu
}
