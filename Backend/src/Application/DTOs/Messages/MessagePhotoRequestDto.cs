using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Messages;

/// <summary>
/// Request DTO for message photo
/// </summary>
public class MessagePhotoRequestDto
{
    [Required(ErrorMessage = "Base64Data is required")]
    public string Base64Data { get; set; } = string.Empty;
}
