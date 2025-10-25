using Infrastructure;
using Infrastructure.Persistance;
using Infrastructure.Services.Seeders;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Application.Authorization.Requirements;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.AddPolicy(
            "AllowFrontend",
            policy =>
            {
                policy
                    .WithOrigins("http://localhost:3000", "https://localhost:3000")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            }
        );
    }
    else
    {
        options.AddPolicy(
            "AllowFrontend",
            policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost",
                        "https://localhost",
                        "http://www.localhost:80",
                        "https://www.localhost:80"
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            }
        );
    }
});

builder.Services.AddInfrastructure(builder.Configuration);

// Authorization Configuration
builder.Services.AddAuthorization(options =>
{
    // Offer Policies
    options.AddPolicy("OfferOwnerPolicy", policy =>
        policy.Requirements.Add(new OfferOwnerRequirement()));

    options.AddPolicy("HostOnlyPolicy", policy =>
        policy.RequireRole("Host"));

    options.AddPolicy("OfferViewPolicy", policy =>
        policy.Requirements.Add(new OfferViewRequirement()));

    // Booking Policies
    options.AddPolicy("BookingOwnerPolicy", policy =>
        policy.Requirements.Add(new BookingOwnerRequirement()));

    options.AddPolicy("BookingHostPolicy", policy =>
        policy.Requirements.Add(new BookingHostRequirement()));

    options.AddPolicy("BookingParticipantPolicy", policy =>
        policy.Requirements.Add(new BookingParticipantRequirement()));

    // Review Policies
    options.AddPolicy("ReviewOwnerPolicy", policy =>
        policy.Requirements.Add(new ReviewOwnerRequirement()));

    options.AddPolicy("ReviewEligibilityPolicy", policy =>
        policy.Requirements.Add(new ReviewEligibilityRequirement()));

    // Message Policies
    options.AddPolicy("ConversationParticipantPolicy", policy =>
        policy.Requirements.Add(new ConversationParticipantRequirement()));

    options.AddPolicy("MessageOwnerPolicy", policy =>
        policy.Requirements.Add(new MessageOwnerRequirement()));

    options.AddPolicy("ConversationInitiatorPolicy", policy =>
        policy.Requirements.Add(new ConversationInitiatorRequirement()));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    
    var databaseSeeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeederService>();
    await databaseSeeder.SeedAllAsync();
}
app.Run();
