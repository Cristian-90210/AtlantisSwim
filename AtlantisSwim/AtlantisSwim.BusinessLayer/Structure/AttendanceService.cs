using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Attendance;
using AtlantisSwim.Domain.Models.Attendance;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class AttendanceService : IAttendanceService
    {
        private readonly DbSession _db;

        public AttendanceService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<AttendanceDto>> GetAllAsync()
        {
            return await BuildQuery().ToListAsync();
        }

        public async Task<List<AttendanceDto>> GetByUserAsync(int userId)
        {
            return await BuildQuery().Where(a => a.UserId == userId).ToListAsync();
        }

        public async Task<List<AttendanceDto>> GetByCourseAsync(int courseId)
        {
            return await BuildQuery().Where(a => a.CourseId == courseId).ToListAsync();
        }

        public async Task<AttendanceDto> CreateAsync(CreateAttendanceDto dto)
        {
            // Upsert: if a record for same user/course/date exists, update status
            var existing = await _db.AttendanceRecords
                .FirstOrDefaultAsync(a => a.UserId == dto.UserId &&
                                         a.CourseId == dto.CourseId &&
                                         a.Date.Date == dto.Date.Date);

            if (existing != null)
            {
                existing.Status = dto.Status;
                existing.MarkedByUserId = dto.MarkedByUserId;
                await _db.SaveChangesAsync();
                return await ToDto(existing);
            }

            var record = new AttendanceRecord
            {
                UserId          = dto.UserId,
                CourseId        = dto.CourseId,
                Date            = dto.Date.Date,
                Status          = dto.Status,
                MarkedByUserId  = dto.MarkedByUserId,
                CreatedAt       = DateTime.UtcNow
            };

            _db.AttendanceRecords.Add(record);
            await _db.SaveChangesAsync();
            return await ToDto(record);
        }

        public async Task<AttendanceDto?> UpdateAsync(int id, UpdateAttendanceDto dto)
        {
            var record = await _db.AttendanceRecords.FindAsync(id);
            if (record == null) return null;

            if (dto.Status != null) record.Status = dto.Status;
            if (dto.Confirmed.HasValue)
            {
                record.Confirmed = dto.Confirmed.Value;
                if (dto.Confirmed.Value)
                {
                    record.ConfirmedByUserId = dto.ConfirmedByUserId;
                    record.ConfirmedAt = DateTime.UtcNow;
                }
            }

            await _db.SaveChangesAsync();
            return await ToDto(record);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var record = await _db.AttendanceRecords.FindAsync(id);
            if (record == null) return false;

            _db.AttendanceRecords.Remove(record);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<AttendanceDto> BuildQuery()
        {
            return from a in _db.AttendanceRecords
                   join u in _db.Users on a.UserId equals u.Id
                   join c in _db.Courses on a.CourseId equals c.Id into courses
                   from c in courses.DefaultIfEmpty()
                   orderby a.Date descending
                   select new AttendanceDto
                   {
                       Id                  = a.Id,
                       UserId              = a.UserId,
                       UserName            = u.FirstName + " " + u.LastName,
                       CourseId            = a.CourseId,
                       CourseName          = c != null ? c.Name : string.Empty,
                       Date                = a.Date,
                       Status              = a.Status,
                       MarkedByUserId      = a.MarkedByUserId,
                       Confirmed           = a.Confirmed,
                       ConfirmedByUserId   = a.ConfirmedByUserId,
                       ConfirmedAt         = a.ConfirmedAt,
                       CreatedAt           = a.CreatedAt
                   };
        }

        private async Task<AttendanceDto> ToDto(AttendanceRecord a)
        {
            var user   = await _db.Users.FindAsync(a.UserId);
            var course = await _db.Courses.FindAsync(a.CourseId);
            return new AttendanceDto
            {
                Id                  = a.Id,
                UserId              = a.UserId,
                UserName            = user != null ? $"{user.FirstName} {user.LastName}" : string.Empty,
                CourseId            = a.CourseId,
                CourseName          = course?.Name ?? string.Empty,
                Date                = a.Date,
                Status              = a.Status,
                MarkedByUserId      = a.MarkedByUserId,
                Confirmed           = a.Confirmed,
                ConfirmedByUserId   = a.ConfirmedByUserId,
                ConfirmedAt         = a.ConfirmedAt,
                CreatedAt           = a.CreatedAt
            };
        }
    }
}
