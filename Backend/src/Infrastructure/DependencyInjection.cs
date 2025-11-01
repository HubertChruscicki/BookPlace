using System.Reflection;
using System.Text;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistance;
using Infrastructure.Persistence.Repositories;
using Infrastructure.Services.Seeders;
using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Application.Authorization.Requirements;
using Application.Interfaces;
using BookPlace.Application.Interfaces;
using Infrastructure.Authorization.Handlers;
using Infrastructure.Services;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
        );

        services
            .AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;

                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"];

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!)),
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddScoped<Application.Interfaces.IJwtService, JwtService>();

        services.AddScoped<IUnitOfWork, Infrastructure.Persistence.UnitOfWork>();

        services.AddScoped<IImageProcessingService, ImageProcessingService>();

        services.AddScoped<IRoleSeederService, RoleSeederService>();
        services.AddScoped<IOfferTypeSeederService, OfferTypeSeederService>();
        services.AddScoped<IAmenitySeederService, AmenitySeederService>();
        services.AddScoped<IDatabaseSeederService, DatabaseSeederService>();


        services.AddAutoMapper(config =>
        {
            config.AddMaps(Assembly.GetExecutingAssembly());
        });

        services.AddMassTransit(x =>
        {
            x.AddConsumers(Assembly.GetExecutingAssembly());
            x.UsingRabbitMq(
                (context, cfg) =>
                {
                    var rabbitMqConfig = configuration.GetSection("RabbitMQ");
                    var hostname = rabbitMqConfig["Hostname"];
                    var username = rabbitMqConfig["Username"];
                    var password = rabbitMqConfig["Password"];
                    cfg.Host(
                        hostname,
                        h =>
                        {
                            h.Username(username!);
                            h.Password(password!);
                        }
                    );
                    cfg.ConfigureEndpoints(context);
                    cfg.UseMessageRetry(r =>
                        r.Exponential(
                            3,
                            TimeSpan.FromSeconds(1),
                            TimeSpan.FromSeconds(30),
                            TimeSpan.FromSeconds(3)
                        )
                    );
                }
            );
        });

        services.AddScoped<IAuthorizationHandler, OfferOwnerAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, BookingOwnerAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, BookingHostAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, BookingParticipantAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ReviewOwnerAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ReviewEligibilityAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ConversationParticipantAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, MessageOwnerAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ConversationInitiatorAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, OfferViewAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, OfferOwnerAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, HostRoleAuthorizationHandler>();

        return services;
    }
}
