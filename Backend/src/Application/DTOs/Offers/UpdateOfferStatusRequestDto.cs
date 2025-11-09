using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.DTOs.Offers;

/// <summary>
/// DTO for updating an offer's status
/// </summary>
public class UpdateOfferStatusRequestDto
{
    [Required(ErrorMessage = "Status is required.")]
    [EnumDataType(typeof(OfferStatus), ErrorMessage = "Invalid status value.")]
    public OfferStatus NewStatus { get; set; }
}