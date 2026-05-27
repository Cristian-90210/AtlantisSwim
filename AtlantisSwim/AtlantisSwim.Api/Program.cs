using System.Text;
using AtlantisSwim.Api.Hubs;
using AtlantisSwim.Api.Services;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.BusinessLayer.Structure;
using AtlantisSwim.DataAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ── Connection string ─────────────────────────────────────────────────────────
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

#pragma warning disable CS0618
DbSession.ConnectionString = connectionString;
#pragma warning restore CS0618

// ── EF Core ───────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<DbSession>(options =>
    options.UseNpgsql(connectionString));

// ── Business layer services ───────────────────────────────────────────────────
builder.Services.AddScoped<IStudentService,       StudentService>();
builder.Services.AddScoped<IAttendanceService,    AttendanceService>();
builder.Services.AddScoped<ISwimmingResultService,SwimmingResultService>();
builder.Services.AddScoped<IBookingService,       BookingService>();
builder.Services.AddScoped<ISubscriptionService,  SubscriptionService>();
builder.Services.AddScoped<IPaymentService,       PaymentService>();
builder.Services.AddScoped<IScheduleService,      ScheduleService>();
builder.Services.AddScoped<IAnnouncementService,  AnnouncementService>();

// ── Startup services ──────────────────────────────────────────────────────────
builder.Services.AddHostedService<PasswordMigrationService>();

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtKey      = builder.Configuration["Jwt:Key"]      ?? "AtlantisSwim-SuperSecret-JWT-Key-2024!@#$%^&*()";
var jwtIssuer   = builder.Configuration["Jwt:Issuer"]   ?? "AtlantisSwim.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "AtlantisSwim.Frontend";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.UseSecurityTokenValidators = true;
        options.MapInboundClaims           = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = jwtIssuer,
            ValidAudience            = jwtAudience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew                = TimeSpan.Zero
        };

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
            },
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices
                    .GetRequiredService<ILogger<Program>>();
                logger.LogError("JWT auth failed: {Type} — {Message}",
                    context.Exception.GetType().Name, context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ── Swagger + JWT Bearer ──────────────────────────────────────────────────────
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "Bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Introduceți token-ul JWT. Exemplu: Bearer {token}"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", document),
            new List<string>()
        }
    });
});

var app = builder.Build();

// ── Auto-apply migrations on startup ─────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DbSession>();
    db.Database.Migrate();
}

// ── Global exception handler ──────────────────────────────────────────────────
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode  = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            error   = "An unexpected error occurred.",
            traceId = context.TraceIdentifier
        });
    });
});

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
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
