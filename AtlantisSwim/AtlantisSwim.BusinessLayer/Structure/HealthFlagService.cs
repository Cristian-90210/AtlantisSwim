using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Health;
using AtlantisSwim.Domain.Models.Health;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class HealthFlagService : IHealthFlagService
    {
        private readonly DbSession _db;

        public HealthFlagService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<HealthFlagDto>> GetAllAsync() =>
            await BuildQuery().ToListAsync();

        public async Task<List<HealthFlagDto>> GetByStudentAsync(int studentUserId) =>
            await BuildQuery().Where(f => f.StudentUserId == studentUserId).ToListAsync();

        public async Task<HealthFlagDto> CreateAsync(CreateHealthFlagDto dto)
        {
            var flag = new StudentHealthFlag
            {
                StudentUserId   = dto.StudentUserId,
                CreatedByUserId = dto.CreatedByUserId,
                Type            = dto.Type,
                Severity        = dto.Severity,
                ProtocolText    = dto.ProtocolText,
                IsActive        = true,
                CreatedAt       = DateTime.UtcNow
            };
            _db.StudentHealthFlags.Add(flag);
            await _db.SaveChangesAsync();
            return await ToDto(flag);
        }

        public async Task<HealthFlagDto?> UpdateAsync(int id, UpdateHealthFlagDto dto)
        {
            var flag = await _db.StudentHealthFlags.FindAsync(id);
            if (flag == null) return null;
            if (dto.Severity     != null) flag.Severity     = dto.Severity;
            if (dto.ProtocolText != null) flag.ProtocolText = dto.ProtocolText;
            if (dto.IsActive.HasValue)    flag.IsActive     = dto.IsActive.Value;
            await _db.SaveChangesAsync();
            return await ToDto(flag);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var flag = await _db.StudentHealthFlags.FindAsync(id);
            if (flag == null) return false;
            _db.StudentHealthFlags.Remove(flag);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<HealthFlagDto> BuildQuery() =>
            from f in _db.StudentHealthFlags
            join s in _db.Users on f.StudentUserId    equals s.Id
            join c in _db.Users on f.CreatedByUserId  equals c.Id
            orderby f.CreatedAt descending
            select new HealthFlagDto
            {
                Id              = f.Id,
                StudentUserId   = f.StudentUserId,
                StudentName     = s.FirstName + " " + s.LastName,
                CreatedByUserId = f.CreatedByUserId,
                CreatedByName   = c.FirstName + " " + c.LastName,
                Type            = f.Type,
                Severity        = f.Severity,
                ProtocolText    = f.ProtocolText,
                IsActive        = f.IsActive,
                CreatedAt       = f.CreatedAt
            };

        private async Task<HealthFlagDto> ToDto(StudentHealthFlag f)
        {
            var student = await _db.Users.FindAsync(f.StudentUserId);
            var creator = await _db.Users.FindAsync(f.CreatedByUserId);
            return new HealthFlagDto
            {
                Id              = f.Id,
                StudentUserId   = f.StudentUserId,
                StudentName     = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                CreatedByUserId = f.CreatedByUserId,
                CreatedByName   = creator != null ? $"{creator.FirstName} {creator.LastName}" : string.Empty,
                Type            = f.Type,
                Severity        = f.Severity,
                ProtocolText    = f.ProtocolText,
                IsActive        = f.IsActive,
                CreatedAt       = f.CreatedAt
            };
        }
    }
}
