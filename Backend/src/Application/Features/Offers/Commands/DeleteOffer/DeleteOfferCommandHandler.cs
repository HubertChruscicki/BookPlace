using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Offers.Commands.DeleteOffer;

/// <summary>
/// Handler for DeleteOfferCommand (Soft Delete)
/// </summary>
public class DeleteOfferCommandHandler : IRequestHandler<DeleteOfferCommand>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteOfferCommandHandler(IUnitOfWork unitOfWork, IAuthorizationService authorizationService, IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task Handle(DeleteOfferCommand request, CancellationToken ct)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
            throw new UnauthorizedAccessException("User context not found.");

        var offer = await _unitOfWork.Offers.GetByIdAsync(request.OfferId, ct);
        if (offer == null)
            throw new KeyNotFoundException($"Offer with ID {request.OfferId} not found.");

        var authResult = await _authorizationService.AuthorizeAsync(user, offer, "OfferOwnerPolicy");
        if (!authResult.Succeeded)
            throw new UnauthorizedAccessException("You are not authorized to delete this offer.");

        offer.Archive();
        await _unitOfWork.SaveChangesAsync(ct); 
    }
}