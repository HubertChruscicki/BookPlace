using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

/// <summary>
/// Extension methods for registering Application layer dependencies
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers Application layer services including AutoMapper and MediatR
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <returns>The service collection</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddAutoMapper(cfg => 
        {
            cfg.AddMaps(typeof(DependencyInjection).Assembly);
        });

        return services;
    }
}
