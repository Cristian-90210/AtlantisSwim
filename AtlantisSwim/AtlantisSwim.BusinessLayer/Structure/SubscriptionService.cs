using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Subscription;
using AtlantisSwim.Domain.Models.Subscription;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly DbSession _db;

        public SubscriptionService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<SubscriptionDto>> GetAllAsync()
        {
            return await BuildQuery().ToListAsync();
        }

        public async Task<SubscriptionDto?> GetActiveByStudentAsync(int studentUserId)
        {
            return await BuildQuery()
                .Where(s => s.StudentUserId == studentUserId && s.Status == "active")
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<List<SubscriptionDto>> GetAllByStudentAsync(int studentUserId)
        {
            return await BuildQuery()
                .Where(s => s.StudentUserId == studentUserId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<SubscriptionDto> CreateAsync(CreateSubscriptionDto dto)
        {
            // Expire any existing active subscriptions for this student
            var active = await _db.Subscriptions
                .Where(s => s.StudentUserId == dto.StudentUserId && s.Status == "active")
                .ToListAsync();
            foreach (var sub in active)
                sub.Status = "expired";

            var subscription = new SubscriptionData
            {
                StudentUserId = dto.StudentUserId,
                ServiceId     = dto.ServiceId,
                PlanName      = dto.PlanName,
                AmountPaid    = dto.AmountPaid,
                SessionsTotal = dto.SessionsTotal,
                SessionsUsed  = 0,
                StartDate     = dto.StartDate.Date,
                ExpiryDate    = dto.ExpiryDate.Date,
                Status        = "active",
                CreatedAt     = DateTime.UtcNow
            };

            _db.Subscriptions.Add(subscription);
            await _db.SaveChangesAsync();
            return await ToDto(subscription);
        }

        public async Task<bool> UseSessionAsync(int studentUserId)
        {
            var sub = await _db.Subscriptions
                .Where(s => s.StudentUserId == studentUserId && s.Status == "active")
                .FirstOrDefaultAsync();

            if (sub == null || sub.SessionsUsed >= sub.SessionsTotal) return false;

            sub.SessionsUsed++;
            if (sub.SessionsUsed >= sub.SessionsTotal)
                sub.Status = "expired";

            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<SubscriptionDto> BuildQuery()
        {
            return from s in _db.Subscriptions
                   join u in _db.Users on s.StudentUserId equals u.Id
                   orderby s.CreatedAt descending
                   select new SubscriptionDto
                   {
                       Id            = s.Id,
                       StudentUserId = s.StudentUserId,
                       StudentName   = u.FirstName + " " + u.LastName,
                       ServiceId     = s.ServiceId,
                       PlanName      = s.PlanName,
                       AmountPaid    = s.AmountPaid,
                       SessionsTotal = s.SessionsTotal,
                       SessionsUsed  = s.SessionsUsed,
                       StartDate     = s.StartDate,
                       ExpiryDate    = s.ExpiryDate,
                       Status        = s.Status,
                       CreatedAt     = s.CreatedAt
                   };
        }

        private async Task<SubscriptionDto> ToDto(SubscriptionData s)
        {
            var user = await _db.Users.FindAsync(s.StudentUserId);
            return new SubscriptionDto
            {
                Id            = s.Id,
                StudentUserId = s.StudentUserId,
                StudentName   = user != null ? $"{user.FirstName} {user.LastName}" : string.Empty,
                ServiceId     = s.ServiceId,
                PlanName      = s.PlanName,
                AmountPaid    = s.AmountPaid,
                SessionsTotal = s.SessionsTotal,
                SessionsUsed  = s.SessionsUsed,
                StartDate     = s.StartDate,
                ExpiryDate    = s.ExpiryDate,
                Status        = s.Status,
                CreatedAt     = s.CreatedAt
            };
        }
    }
}
