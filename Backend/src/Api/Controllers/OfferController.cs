using Application.DTOs.Offers;
using Application.Features.Offers.Commands;
using Application.Features.Offers.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class OfferController : ControllerBase
{
    private readonly IMediator _mediator;

    public OfferController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetPaginated([FromQuery] GetPaginatedOffersQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new offer (Host only)
    /// </summary>
    /// <param name="dto">Offer creation data</param>
    /// <returns>Created offer details</returns>
    [HttpPost]
    [Authorize(Policy = "HostOnly")]
    public async Task<IActionResult> CreateOffer([FromBody] CreateOfferDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        
        var command = new CreateOfferCommand 
        { 
            UserId = userId, 
            OfferData = dto 
        };
        
        var result = await _mediator.Send(command);
        return Created("Offer successfully created ", result);
    }

}