using Application.Features.Offers.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
}