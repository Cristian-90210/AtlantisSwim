using AtlantisSwim.Domain.Entities.Course;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.DataAccess.Context
{
    public class CourseContext : DbContext
    {
        public DbSet<CourseData> Courses { get; set; }
        public DbSet<CourseLevelData> CourseLevels { get; set; }
        public DbSet<CourseImg> CourseImgs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
