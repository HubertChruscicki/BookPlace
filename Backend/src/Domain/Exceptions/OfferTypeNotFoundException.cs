using System;

namespace Domain.Exceptions;

/// <summary>
/// Exception thrown when an offer type with specified ID does not exist
/// </summary>
public class OfferTypeNotFoundException : Exception
{
    /// <summary>
    /// Initializes a new instance of the OfferTypeNotFoundException class
    /// </summary>
    /// <param name="offerTypeId">The ID of the offer type that was not found</param>
    public OfferTypeNotFoundException(int offerTypeId) 
        : base($"Offer type with ID {offerTypeId} does not exist")
    {
        OfferTypeId = offerTypeId;
    }

    public int OfferTypeId { get; }
}
