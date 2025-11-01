using System;
using System.Collections.Generic;
using System.Linq;

namespace Domain.Exceptions;

/// <summary>
/// Exception thrown when one or more amenities with specified IDs do not exist
/// </summary>
public class AmenitiesNotFoundException : Exception
{
    /// <summary>
    /// Initializes a new instance of the AmenitiesNotFoundException class
    /// </summary>
    /// <param name="missingAmenityIds">The IDs of amenities that were not found</param>
    public AmenitiesNotFoundException(IEnumerable<int> missingAmenityIds) 
        : base($"Amenities with IDs [{string.Join(", ", missingAmenityIds)}] do not exist")
    {
        MissingAmenityIds = missingAmenityIds.ToList();
    }
    public List<int> MissingAmenityIds { get; }
}
