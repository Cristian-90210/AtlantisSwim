using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Results;
using AtlantisSwim.Domain.Models.Results;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class SwimmingResultService : ISwimmingResultService
    {
        private readonly DbSession _db;

        public SwimmingResultService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<SwimmingResultDto>> GetAllAsync()
        {
            return await BuildQuery().ToListAsync();
        }

        public async Task<List<SwimmingResultDto>> GetByStudentAsync(int studentUserId)
        {
            return await BuildQuery().Where(r => r.StudentUserId == studentUserId).ToListAsync();
        }

        public async Task<List<SwimmingResultDto>> GetByCoachAsync(int coachUserId)
        {
            return await BuildQuery().Where(r => r.CoachUserId == coachUserId).ToListAsync();
        }

        public async Task<SwimmingResultDto> CreateAsync(CreateSwimmingResultDto dto)
        {
            var result = new SwimmingResult
            {
                StudentUserId = dto.StudentUserId,
                CoachUserId   = dto.CoachUserId,
                Style         = dto.Style,
                Distance      = dto.Distance,
                Time          = dto.Time,
                Date          = dto.Date.Date,
                Notes         = dto.Notes,
                CreatedAt     = DateTime.UtcNow
            };

            _db.SwimmingResults.Add(result);
            await _db.SaveChangesAsync();
            return await ToDto(result);
        }

        public async Task<SwimmingResultDto?> UpdateAsync(int id, CreateSwimmingResultDto dto)
        {
            var result = await _db.SwimmingResults.FindAsync(id);
            if (result == null) return null;

            result.Style    = dto.Style;
            result.Distance = dto.Distance;
            result.Time     = dto.Time;
            result.Date     = dto.Date.Date;
            result.Notes    = dto.Notes;

            await _db.SaveChangesAsync();
            return await ToDto(result);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var result = await _db.SwimmingResults.FindAsync(id);
            if (result == null) return false;

            _db.SwimmingResults.Remove(result);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<SwimmingResultDto> BuildQuery()
        {
            return from r in _db.SwimmingResults
                   join s in _db.Users on r.StudentUserId equals s.Id
                   join c in _db.Users on r.CoachUserId equals c.Id
                   orderby r.Date descending
                   select new SwimmingResultDto
                   {
                       Id            = r.Id,
                       StudentUserId = r.StudentUserId,
                       StudentName   = s.FirstName + " " + s.LastName,
                       CoachUserId   = r.CoachUserId,
                       CoachName     = c.FirstName + " " + c.LastName,
                       Style         = r.Style,
                       Distance      = r.Distance,
                       Time          = r.Time,
                       Date          = r.Date,
                       Notes         = r.Notes,
                       CreatedAt     = r.CreatedAt
                   };
        }

        private async Task<SwimmingResultDto> ToDto(SwimmingResult r)
        {
            var student = await _db.Users.FindAsync(r.StudentUserId);
            var coach   = await _db.Users.FindAsync(r.CoachUserId);
            return new SwimmingResultDto
            {
                Id            = r.Id,
                StudentUserId = r.StudentUserId,
                StudentName   = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                CoachUserId   = r.CoachUserId,
                CoachName     = coach != null ? $"{coach.FirstName} {coach.LastName}" : string.Empty,
                Style         = r.Style,
                Distance      = r.Distance,
                Time          = r.Time,
                Date          = r.Date,
                Notes         = r.Notes,
                CreatedAt     = r.CreatedAt
            };
        }
    }
}
