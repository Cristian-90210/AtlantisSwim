using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Progress;
using AtlantisSwim.Domain.Models.Progress;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class ProgressService : IProgressService
    {
        private readonly DbSession _db;

        public ProgressService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<ProgressSnapshotDto>> GetAllAsync() =>
            await BuildQuery().ToListAsync();

        public async Task<List<ProgressSnapshotDto>> GetByStudentAsync(int studentUserId) =>
            await BuildQuery().Where(p => p.StudentUserId == studentUserId).ToListAsync();

        public async Task<List<ProgressSnapshotDto>> GetLatestByStudentAsync(int studentUserId)
        {
            // Step 1: fetch the ID of the most-recent snapshot per MetricKey in the database
            var latestIds = await _db.ProgressSnapshots
                .Where(p => p.StudentUserId == studentUserId)
                .GroupBy(p => p.MetricKey)
                .Select(g => g.OrderByDescending(p => p.RecordedAt).First().Id)
                .ToListAsync();

            if (latestIds.Count == 0)
                return new List<ProgressSnapshotDto>();

            // Step 2: load the full enriched DTOs for those IDs
            return await BuildQuery()
                .Where(p => latestIds.Contains(p.Id))
                .ToListAsync();
        }

        public async Task<ProgressSnapshotDto> CreateAsync(CreateProgressSnapshotDto dto)
        {
            var snapshot = new ProgressSnapshot
            {
                StudentUserId = dto.StudentUserId,
                CoachUserId   = dto.CoachUserId,
                MetricKey     = dto.MetricKey,
                MetricValue   = dto.MetricValue,
                RecordedAt    = dto.RecordedAt,
                CreatedAt     = DateTime.UtcNow
            };
            _db.ProgressSnapshots.Add(snapshot);
            await _db.SaveChangesAsync();
            return await ToDto(snapshot);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var snapshot = await _db.ProgressSnapshots.FindAsync(id);
            if (snapshot == null) return false;
            _db.ProgressSnapshots.Remove(snapshot);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<ProgressSnapshotDto> BuildQuery() =>
            from p in _db.ProgressSnapshots
            join s in _db.Users on p.StudentUserId equals s.Id
            join c in _db.Users on p.CoachUserId equals c.Id into coaches
            from c in coaches.DefaultIfEmpty()
            orderby p.RecordedAt descending
            select new ProgressSnapshotDto
            {
                Id            = p.Id,
                StudentUserId = p.StudentUserId,
                StudentName   = s.FirstName + " " + s.LastName,
                CoachUserId   = p.CoachUserId,
                CoachName     = c != null ? c.FirstName + " " + c.LastName : null,
                MetricKey     = p.MetricKey,
                MetricValue   = p.MetricValue,
                RecordedAt    = p.RecordedAt,
                CreatedAt     = p.CreatedAt
            };

        private async Task<ProgressSnapshotDto> ToDto(ProgressSnapshot p)
        {
            var student = await _db.Users.FindAsync(p.StudentUserId);
            var coach = p.CoachUserId.HasValue ? await _db.Users.FindAsync(p.CoachUserId.Value) : null;
            return new ProgressSnapshotDto
            {
                Id            = p.Id,
                StudentUserId = p.StudentUserId,
                StudentName   = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                CoachUserId   = p.CoachUserId,
                CoachName     = coach  != null ? $"{coach.FirstName} {coach.LastName}" : null,
                MetricKey     = p.MetricKey,
                MetricValue   = p.MetricValue,
                RecordedAt    = p.RecordedAt,
                CreatedAt     = p.CreatedAt
            };
        }
    }
}
