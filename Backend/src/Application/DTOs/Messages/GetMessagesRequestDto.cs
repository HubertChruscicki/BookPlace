using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Messages;

/// <summary>
/// Request DTO for retrieving paginated messages for a conversation.
/// </summary>
public class GetMessagesRequestDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int PageNumber { get; set; } = 0;

    [Range(1, int.MaxValue, ErrorMessage = "Page size must be greater than 0")]
    public int PageSize { get; set; } = 10;
}