using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.DTOs.Offers;

/// <summary>
/// Request DTO for retrieving paginated offers for the currently authenticated Host
/// </summary>
public class GetMyOffersRequestDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
    public int PageNumber { get; set; } = 1;

    [Range(1, int.MaxValue, ErrorMessage = "Page size must be greater than 0")]
    public int PageSize { get; set; } = 10;

    [EnumDataType(typeof(OfferStatus), ErrorMessage = "Invalid status value")]
    public OfferStatus? Status { get; set; }

    public bool? IncludeArchived { get; set; } = false; 
}