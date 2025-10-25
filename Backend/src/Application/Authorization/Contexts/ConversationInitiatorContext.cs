namespace Application.Authorization.Contexts;

public class ConversationInitiatorContext
{
    public int? OfferId { get; set; } // nullable - dla konwersacji o ofercie
    public int? ReviewId { get; set; } // nullable - dla konwersacji o opinii
    public string InitiatorId { get; set; } = string.Empty;
}

