using AtlantisSwim.Domain.Entities.SwimmingService;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.DataAccess.Context
{
    public class SwimmingServiceContext : DbContext
    {
        public DbSet<SwimmingServiceData> SwimmingServices { get; set; }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
