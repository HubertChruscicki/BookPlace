using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Conversations;

/// <summary>
/// Request DTO for retrieving paginated user conversations (inbox).
/// </summary>
public class GetConversationsRequestDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int PageNumber { get; set; } = 0;

    [Range(1, int.MaxValue, ErrorMessage = "Page size must be be greater than 0")]
    public int PageSize { get; set; } = 10;
    
    [Required(ErrorMessage = "Role is required")]
    [RegularExpression("^(|guest|host)$", ErrorMessage = "Role must be 'guest', 'host', or empty")]
    public string Role { get; set; } = string.Empty;
    
}