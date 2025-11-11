using System.Reflection;
using Api.Middleware;
using Application;
using Infrastructure;
using Infrastructure.Persistance;
using Infrastructure.Services.Seeders;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Application.Authorization.Requirements;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});


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

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OfferOwnerPolicy", policy =>
        policy.Requirements.Add(new OfferOwnerRequirement()));

    options.AddPolicy("HostOnlyPolicy", policy =>
        policy.RequireRole("Host"));

    options.AddPolicy("HostOnly", policy =>
        policy.Requirements.Add(new HostRoleRequirement()));

    options.AddPolicy("OfferViewPolicy", policy =>
        policy.Requirements.Add(new OfferViewRequirement()));

    options.AddPolicy("BookingOwnerPolicy", policy =>
        policy.Requirements.Add(new BookingOwnerRequirement()));

    options.AddPolicy("BookingHostPolicy", policy =>
        policy.Requirements.Add(new BookingHostRequirement()));

    options.AddPolicy("BookingParticipantPolicy", policy =>
        policy.Requirements.Add(new BookingParticipantRequirement()));

    options.AddPolicy("ReviewOwnerPolicy", policy =>
        policy.Requirements.Add(new ReviewOwnerRequirement()));

    options.AddPolicy("ReviewEligibilityPolicy", policy =>
        policy.Requirements.Add(new ReviewEligibilityRequirement()));

    options.AddPolicy("ConversationParticipantPolicy", policy =>
        policy.Requirements.Add(new ConversationParticipantRequirement()));

    options.AddPolicy("MessageOwnerPolicy", policy =>
        policy.Requirements.Add(new MessageOwnerRequirement()));

    options.AddPolicy("ConversationInitiatorPolicy", policy =>
        policy.Requirements.Add(new ConversationInitiatorRequirement()));

    options.AddPolicy("GuestOnlyPolicy", policy =>
        policy.Requirements.Add(new GuestOnlyRequirement()));
});

var app = builder.Build();
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "BookPlaceApi"); 
        c.UseRequestInterceptor("(request) => { request.credentials = 'include'; return request; }");
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseMiddleware<TokenWhitelistMiddleware>();
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
