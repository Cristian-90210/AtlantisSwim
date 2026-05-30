using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Recovery;
using AtlantisSwim.Domain.Models.Recovery;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class RecoveryRequestService : IRecoveryRequestService
    {
        private readonly DbSession _db;

        public RecoveryRequestService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<RecoveryRequestDto>> GetAllAsync() =>
            await BuildQuery().ToListAsync();

        public async Task<List<RecoveryRequestDto>> GetByStudentAsync(int studentUserId) =>
            await BuildQuery().Where(r => r.StudentUserId == studentUserId).ToListAsync();

        public async Task<List<RecoveryRequestDto>> GetByCoachAsync(int coachUserId) =>
            await BuildQuery().Where(r => r.CoachUserId == coachUserId).ToListAsync();

        public async Task<RecoveryRequestDto> CreateAsync(CreateRecoveryRequestDto dto)
        {
            var request = new RecoveryRequest
            {
                StudentUserId = dto.StudentUserId,
                Date          = dto.Date,
                Status        = "Pending",
                Notes         = dto.Notes,
                RequestedAt   = DateTime.UtcNow
            };
            _db.RecoveryRequests.Add(request);
            await _db.SaveChangesAsync();
            return await ToDto(request);
        }

        public async Task<RecoveryRequestDto?> UpdateAsync(int id, UpdateRecoveryRequestDto dto)
        {
            var request = await _db.RecoveryRequests.FindAsync(id);
            if (request == null) return null;

            if (dto.Status     != null) request.Status     = dto.Status;
            if (dto.CoachUserId.HasValue)
            {
                request.CoachUserId  = dto.CoachUserId;
                request.ConfirmedAt  = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
            return await ToDto(request);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var request = await _db.RecoveryRequests.FindAsync(id);
            if (request == null) return false;
            _db.RecoveryRequests.Remove(request);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<RecoveryRequestDto> BuildQuery() =>
            from r in _db.RecoveryRequests
            join s in _db.Users on r.StudentUserId equals s.Id
            join c in _db.Users on r.CoachUserId equals c.Id into coaches
            from c in coaches.DefaultIfEmpty()
            orderby r.RequestedAt descending
            select new RecoveryRequestDto
            {
                Id            = r.Id,
                StudentUserId = r.StudentUserId,
                StudentName   = s.FirstName + " " + s.LastName,
                CoachUserId   = r.CoachUserId,
                CoachName     = c != null ? c.FirstName + " " + c.LastName : null,
                Date          = r.Date,
                Status        = r.Status,
                Notes         = r.Notes,
                ConfirmedAt   = r.ConfirmedAt,
                RequestedAt   = r.RequestedAt
            };

        private async Task<RecoveryRequestDto> ToDto(RecoveryRequest r)
        {
            var student = await _db.Users.FindAsync(r.StudentUserId);
            var coach = r.CoachUserId.HasValue ? await _db.Users.FindAsync(r.CoachUserId.Value) : null;
            return new RecoveryRequestDto
            {
                Id            = r.Id,
                StudentUserId = r.StudentUserId,
                StudentName   = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                CoachUserId   = r.CoachUserId,
                CoachName     = coach  != null ? $"{coach.FirstName} {coach.LastName}" : null,
                Date          = r.Date,
                Status        = r.Status,
                Notes         = r.Notes,
                ConfirmedAt   = r.ConfirmedAt,
                RequestedAt   = r.RequestedAt
            };
        }
    }
}
