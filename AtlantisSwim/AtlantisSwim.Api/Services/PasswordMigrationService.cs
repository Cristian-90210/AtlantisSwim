using AtlantisSwim.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Services
{
    /// <summary>
    /// Runs once at startup to hash any plain-text passwords that predate BCrypt adoption.
    /// </summary>
    public class PasswordMigrationService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PasswordMigrationService> _logger;

        public PasswordMigrationService(IServiceProvider serviceProvider, ILogger<PasswordMigrationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DbSession>();

            var users = await db.Users.ToListAsync(cancellationToken);
            int migrated = 0;

            foreach (var user in users)
            {
                if (!user.Password.StartsWith("$2a$") && !user.Password.StartsWith("$2b$"))
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                    migrated++;
                }
            }

            if (migrated > 0)
            {
                await db.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("PasswordMigration: hashed {Count} plain-text passwords.", migrated);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
