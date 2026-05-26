using System.Text;
using AtlantisSwim.Api.Hubs;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.BusinessLayer.Structure;
using AtlantisSwim.DataAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── Connection string ─────────────────────────────────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in configuration.");

// Make connection string available to legacy context classes (UserContext, CourseContext, etc.)
#pragma warning disable CS0618
DbSession.ConnectionString = connectionString;
#pragma warning restore CS0618

// ── EF Core — register DbSession via dependency injection ─────────────────────
builder.Services.AddDbContext<DbSession>(options =>
    options.UseNpgsql(connectionString));

// ── Business layer services ───────────────────────────────────────────────────
builder.Services.AddScoped<IStudentService, StudentService>();

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtKey      = builder.Configuration["Jwt:Key"]      ?? "AtlantisSwim-SuperSecret-JWT-Key-2024!@#$%^&*()";
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "AtlantisSwim.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "AtlantisSwim.Frontend";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        // SignalR sends the token via query string because WebSocket doesn't support headers
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(accessToken) &&
                    context.HttpContext.Request.Path.StartsWithSegments("/hubs/chat"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // required for SignalR WebSocket
    });
});

builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
