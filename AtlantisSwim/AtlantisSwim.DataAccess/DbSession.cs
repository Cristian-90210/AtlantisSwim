using AtlantisSwim.Domain.Entities.Chat;
using AtlantisSwim.Domain.Entities.Course;
using AtlantisSwim.Domain.Entities.Student;
using AtlantisSwim.Domain.Entities.SwimmingService;
using AtlantisSwim.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.DataAccess
{
    public class DbSession : DbContext
    {
        // Kept for backward compatibility with existing code that may reference it
        [Obsolete("Use dependency injection instead. This property will be removed in a future version.")]
        public static string? ConnectionString { get; set; }

        // Parameterless constructor — used by design-time tools (migrations)
        public DbSession() { }

        // DI constructor — primary constructor used by ASP.NET Core
        public DbSession(DbContextOptions<DbSession> options) : base(options) { }

        // ── DbSets ──────────────────────────────────────────────────────────────
        public DbSet<UserData> Users { get; set; }
        public DbSet<CourseData> Courses { get; set; }
        public DbSet<CourseLevelData> CourseLevels { get; set; }
        public DbSet<CourseImg> CourseImgs { get; set; }
        public DbSet<SwimmingServiceData> SwimmingServices { get; set; }
        public DbSet<StudentData> Students { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }

        // ── Configuration ────────────────────────────────────────────────────────
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Disabled to avoid overriding DI configuration
        }

        // ── Seed Data ────────────────────────────────────────────────────────────
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Students (existing — do not change) ──────────────────────────────
            modelBuilder.Entity<StudentData>().HasData(
                new StudentData
                {
                    Id = 1,
                    FirstName = "Maria",
                    LastName = "Ionescu",
                    Email = "maria.ionescu@email.com",
                    Phone = "0721000001",
                    DateOfBirth = new DateTime(2005, 3, 15, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Beginner",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new StudentData
                {
                    Id = 2,
                    FirstName = "Andrei",
                    LastName = "Popescu",
                    Email = "andrei.popescu@email.com",
                    Phone = "0721000002",
                    DateOfBirth = new DateTime(2003, 7, 22, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Intermediate",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new StudentData
                {
                    Id = 3,
                    FirstName = "Elena",
                    LastName = "Constantin",
                    Email = "elena.constantin@email.com",
                    Phone = "0721000003",
                    DateOfBirth = new DateTime(2001, 11, 8, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Advanced",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 10, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                // ── Students from mockStudents (frontend) ────────────────────────
                new StudentData
                {
                    Id = 4,
                    FirstName = "Andrei",
                    LastName = "Popov",
                    Email = "andrei.p@gmail.com",
                    Phone = "0721000004",
                    DateOfBirth = new DateTime(2014, 5, 15, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Beginner",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new StudentData
                {
                    Id = 5,
                    FirstName = "Elena",
                    LastName = "Dumitru",
                    Email = "elena.d@yahoo.com",
                    Phone = "0721000005",
                    DateOfBirth = new DateTime(2002, 3, 20, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Advanced",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new StudentData
                {
                    Id = 6,
                    FirstName = "Mihai",
                    LastName = "Voicu",
                    Email = "mihai.v@gmail.com",
                    Phone = "0721000006",
                    DateOfBirth = new DateTime(2008, 7, 10, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Intermediate",
                    IsActive = false,
                    EnrolledOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new StudentData
                {
                    Id = 7,
                    FirstName = "Ioana",
                    LastName = "Stan",
                    Email = "ioana.s@gmail.com",
                    Phone = "0721000007",
                    DateOfBirth = new DateTime(2016, 2, 28, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Beginner",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 10, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new StudentData
                {
                    Id = 8,
                    FirstName = "George",
                    LastName = "Enescu",
                    Email = "george.e@music.com",
                    Phone = "0721000008",
                    DateOfBirth = new DateTime(1995, 11, 25, 0, 0, 0, DateTimeKind.Utc),
                    SwimmingLevel = "Advanced",
                    IsActive = true,
                    EnrolledOn = new DateTime(2024, 11, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ── CourseLevels ─────────────────────────────────────────────────────
            modelBuilder.Entity<CourseLevelData>().HasData(
                new CourseLevelData { Id = 1, Name = "Beginner",     Description = "For those with no prior swimming experience." },
                new CourseLevelData { Id = 2, Name = "Intermediate", Description = "For swimmers comfortable in water." },
                new CourseLevelData { Id = 3, Name = "Advanced",     Description = "For experienced swimmers refining technique." }
            );

            // ── Courses (LevelId is a shadow FK — must use anonymous type) ───────
            modelBuilder.Entity<CourseData>().HasData(
                new
                {
                    Id = 1,
                    Name = "Learn to Swim",
                    Description = "A foundational course covering basic strokes and water safety.",
                    Price = 150.00m,
                    Capacity = 12,
                    Enrolled = 0,
                    Schedule = "Mon, Wed 09:00",
                    LevelId = 1,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new
                {
                    Id = 2,
                    Name = "Stroke Improvement",
                    Description = "Focus on freestyle and breaststroke technique for intermediate swimmers.",
                    Price = 200.00m,
                    Capacity = 10,
                    Enrolled = 0,
                    Schedule = "Tue, Thu 18:00",
                    LevelId = 2,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new
                {
                    Id = 3,
                    Name = "Competitive Training",
                    Description = "High-intensity training for competitive swimmers.",
                    Price = 280.00m,
                    Capacity = 8,
                    Enrolled = 0,
                    Schedule = "Mon, Wed, Fri 07:00",
                    LevelId = 3,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ── SwimmingServices ─────────────────────────────────────────────────
            modelBuilder.Entity<SwimmingServiceData>().HasData(
                new SwimmingServiceData
                {
                    Id = 1,
                    ServiceName = "Private Lessons",
                    ServiceDescription = "One-on-one coaching sessions tailored to individual needs.",
                    ServicePrice = 80.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 2,
                    ServiceName = "Group Classes",
                    ServiceDescription = "Small group lessons with up to 6 participants.",
                    ServicePrice = 40.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 3,
                    ServiceName = "Pool Lane Rental",
                    ServiceDescription = "Dedicated lane access for personal training sessions.",
                    ServicePrice = 25.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ── Users (existing: 1=Admin, 2=Coach) ───────────────────────────────
            modelBuilder.Entity<UserData>().HasData(
                new UserData
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "Atlantis",
                    UserName = "admin",
                    Email = "admin@atlantisswim.ro",
                    Password = "Admin@1234",
                    Phone = "0700000001",
                    Role = UserRole.Admin,
                    RegisteredOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 2,
                    FirstName = "Ioan",
                    LastName = "Marinescu",
                    UserName = "coach.ioan",
                    Email = "coach@atlantisswim.ro",
                    Password = "Coach@1234",
                    Phone = "0700000002",
                    Role = UserRole.Coach,
                    RegisteredOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // ── Coaches from mockUserAccounts ────────────────────────────────
                new UserData
                {
                    Id = 3,
                    FirstName = "Cătălina",
                    LastName = "Moraru",
                    UserName = "catalina",
                    Email = "catalina@atlantisswim.md",
                    Password = "antrenor1234",
                    Phone = "0700000003",
                    Role = UserRole.Coach,
                    RegisteredOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 4,
                    FirstName = "Cătălin",
                    LastName = "Ciobanu",
                    UserName = "catalin",
                    Email = "catalin@atlantisswim.md",
                    Password = "antrenor1234",
                    Phone = "0700000004",
                    Role = UserRole.Coach,
                    RegisteredOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 5,
                    FirstName = "Alexandru",
                    LastName = "Rusu",
                    UserName = "alexandru",
                    Email = "alexandru@atlantisswim.md",
                    Password = "antrenor1234",
                    Phone = "0700000005",
                    Role = UserRole.Coach,
                    RegisteredOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // ── Admins from mockUserAccounts ─────────────────────────────────
                new UserData
                {
                    Id = 6,
                    FirstName = "Super",
                    LastName = "Admin",
                    UserName = "super.admin",
                    Email = "admin@school.com",
                    Password = "admin1234",
                    Phone = "0700000006",
                    Role = UserRole.Admin,
                    RegisteredOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 7,
                    FirstName = "Director",
                    LastName = "Ionescu",
                    UserName = "director",
                    Email = "director@school.com",
                    Password = "admin1234",
                    Phone = "0700000007",
                    Role = UserRole.Admin,
                    RegisteredOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 8,
                    FirstName = "Manager",
                    LastName = "Stancu",
                    UserName = "manager",
                    Email = "manager@school.com",
                    Password = "admin1234",
                    Phone = "0700000008",
                    Role = UserRole.Admin,
                    RegisteredOn = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // ── Student accounts from mockUserAccounts ───────────────────────
                new UserData
                {
                    Id = 9,
                    FirstName = "Andrei",
                    LastName = "Popov",
                    UserName = "andrei.popov",
                    Email = "andrei.popov@student.md",
                    Password = "elev1234",
                    Phone = "0700000009",
                    Role = UserRole.Student,
                    RegisteredOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 10,
                    FirstName = "Elena",
                    LastName = "Dumitru",
                    UserName = "elena.dumitru",
                    Email = "elena.dumitru@student.md",
                    Password = "elev1234",
                    Phone = "0700000010",
                    Role = UserRole.Student,
                    RegisteredOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new UserData
                {
                    Id = 11,
                    FirstName = "Mihai",
                    LastName = "Voicu",
                    UserName = "mihai.voicu",
                    Email = "mihai.voicu@student.md",
                    Password = "elev1234",
                    Phone = "0700000011",
                    Role = UserRole.Student,
                    RegisteredOn = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ── Courses from mockCourses (existing: 1-3) ─────────────────────────
            modelBuilder.Entity<CourseData>().HasData(
                new
                {
                    Id = 4,
                    Name = "Beginner Swim - Kids",
                    Description = "Learn the basics of floating and kicking.",
                    Price = 250.00m,
                    Capacity = 10,
                    Enrolled = 8,
                    Schedule = "Mon, Wed 16:00",
                    LevelId = 1,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new
                {
                    Id = 5,
                    Name = "Advanced Freestyle",
                    Description = "Refine your technique for competition.",
                    Price = 400.00m,
                    Capacity = 15,
                    Enrolled = 12,
                    Schedule = "Tue, Thu 19:00",
                    LevelId = 3,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new
                {
                    Id = 6,
                    Name = "Backstroke Mastery",
                    Description = "Perfect your backstroke form.",
                    Price = 300.00m,
                    Capacity = 8,
                    Enrolled = 5,
                    Schedule = "Fri 17:00, Sat 10:00",
                    LevelId = 2,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ── SwimmingServices from subscriptionPlans (existing: 1-3) ──────────
            modelBuilder.Entity<SwimmingServiceData>().HasData(
                new SwimmingServiceData
                {
                    Id = 4,
                    ServiceName = "Abonament 4 Frecvențe",
                    ServiceDescription = "4 lecții de înot în grup, valabil 1 lună. Durata: 45 min/ședință.",
                    ServicePrice = 1000.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 5,
                    ServiceName = "Abonament Standard 8 Frecvențe",
                    ServiceDescription = "8 lecții de înot în grup, valabil 1 lună. Durata: 45 min/ședință.",
                    ServicePrice = 2000.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 6,
                    ServiceName = "Abonament Pro 12 Frecvențe",
                    ServiceDescription = "12 antrenamente în grup, valabil 1 lună. Ideal pentru progres rapid.",
                    ServicePrice = 3000.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 7,
                    ServiceName = "Abonament Standard 3 Luni",
                    ServiceDescription = "24 lecții în grup (8/lună × 3 luni). Progres constant, reducere 10%.",
                    ServicePrice = 5400.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 8,
                    ServiceName = "Abonament Pro 3 Luni",
                    ServiceDescription = "36 lecții în grup (12/lună × 3 luni). Progres accelerat, reducere 10%.",
                    ServicePrice = 7500.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 9,
                    ServiceName = "Abonament Individual 5",
                    ServiceDescription = "5 ședințe individuale 1 la 1, valabil 3 săptămâni. Durata: 45 min/ședință.",
                    ServicePrice = 2250.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 10,
                    ServiceName = "Abonament Individual 10",
                    ServiceDescription = "10 ședințe individuale 1 la 1, valabil 5 săptămâni. Reducere 7%.",
                    ServicePrice = 4500.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 11,
                    ServiceName = "Abonament Transport Chișinău",
                    ServiceDescription = "8 ședințe cu transport tur-retur din Chișinău, valabil 1 lună.",
                    ServicePrice = 2400.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new SwimmingServiceData
                {
                    Id = 12,
                    ServiceName = "Abonament Transport Ialoveni",
                    ServiceDescription = "8 ședințe cu transport din Ialoveni la Arena Chișinău, valabil 1 lună.",
                    ServicePrice = 2600.00m,
                    IsDeleted = false,
                    CreatedAt = new DateTime(2024, 9, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
