using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Recovery;
using AtlantisSwim.Domain.Models.Recovery;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class RecoveryCreditService : IRecoveryCreditService
    {
        private readonly DbSession _db;

        public RecoveryCreditService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<RecoveryCreditDto>> GetAllAsync() =>
            await BuildQuery().ToListAsync();

        public async Task<List<RecoveryCreditDto>> GetByStudentAsync(int studentUserId) =>
            await BuildQuery().Where(r => r.StudentUserId == studentUserId).ToListAsync();

        public async Task<RecoveryCreditDto> CreateAsync(CreateRecoveryCreditDto dto)
        {
            var credit = new RecoveryCredit
            {
                StudentUserId      = dto.StudentUserId,
                SourceAttendanceId = dto.SourceAttendanceId,
                Status             = "active",
                ExpiresAt          = dto.ExpiresAt,
                CreatedAt          = DateTime.UtcNow
            };
            _db.RecoveryCredits.Add(credit);
            await _db.SaveChangesAsync();
            return await ToDto(credit);
        }

        public async Task<RecoveryCreditDto?> UpdateAsync(int id, UpdateRecoveryCreditDto dto)
        {
            var credit = await _db.RecoveryCredits.FindAsync(id);
            if (credit == null) return null;
            if (dto.Status              != null) credit.Status              = dto.Status;
            if (dto.ConsumedByBookingId != null) credit.ConsumedByBookingId = dto.ConsumedByBookingId;
            await _db.SaveChangesAsync();
            return await ToDto(credit);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var credit = await _db.RecoveryCredits.FindAsync(id);
            if (credit == null) return false;
            _db.RecoveryCredits.Remove(credit);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<RecoveryCreditDto> BuildQuery() =>
            from r in _db.RecoveryCredits
            join s in _db.Users on r.StudentUserId equals s.Id
            orderby r.CreatedAt descending
            select new RecoveryCreditDto
            {
                Id                 = r.Id,
                StudentUserId      = r.StudentUserId,
                StudentName        = s.FirstName + " " + s.LastName,
                SourceAttendanceId = r.SourceAttendanceId,
                Status             = r.Status,
                ConsumedByBookingId = r.ConsumedByBookingId,
                ExpiresAt          = r.ExpiresAt,
                CreatedAt          = r.CreatedAt
            };

        private async Task<RecoveryCreditDto> ToDto(RecoveryCredit r)
        {
            var student = await _db.Users.FindAsync(r.StudentUserId);
            return new RecoveryCreditDto
            {
                Id                  = r.Id,
                StudentUserId       = r.StudentUserId,
                StudentName         = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                SourceAttendanceId  = r.SourceAttendanceId,
                Status              = r.Status,
                ConsumedByBookingId = r.ConsumedByBookingId,
                ExpiresAt           = r.ExpiresAt,
                CreatedAt           = r.CreatedAt
            };
        }
    }
}
