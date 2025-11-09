using Application.DTOs.Offers;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Application.Features.Offers.Commands.UpdateStatus;

/// <summary>
/// Handler for UpdateOfferStatusCommand
/// </summary>
public class UpdateOfferStatusCommandHandler : IRequestHandler<UpdateOfferStatusCommand, OfferDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateOfferStatusCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuthorizationService authorizationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<OfferDto> Handle(UpdateOfferStatusCommand request, CancellationToken ct)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null)
            throw new UnauthorizedAccessException("User context not found.");

        var offer = await _unitOfWork.Offers.GetByIdAsync(request.OfferId, ct);
        if (offer == null)
            throw new KeyNotFoundException($"Offer with ID {request.OfferId} not found.");

        var authResult = await _authorizationService.AuthorizeAsync(user, offer, "OfferOwnerPolicy");
        if (!authResult.Succeeded)
            throw new UnauthorizedAccessException("You are not authorized to update this offer.");

        offer.UpdateStatus(request.NewStatus);
        await _unitOfWork.SaveChangesAsync(ct);

        return _mapper.Map<OfferDto>(offer);
    }
}