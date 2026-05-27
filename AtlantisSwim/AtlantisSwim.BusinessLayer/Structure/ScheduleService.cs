using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Schedule;
using AtlantisSwim.Domain.Models.Schedule;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class ScheduleService : IScheduleService
    {
        private readonly DbSession _db;

        public ScheduleService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<ScheduleSlotDto>> GetAllAsync()
        {
            return await BuildQuery().ToListAsync();
        }

        public async Task<List<ScheduleSlotDto>> GetByCoachAsync(int coachUserId)
        {
            return await BuildQuery().Where(s => s.CoachUserId == coachUserId).ToListAsync();
        }

        public async Task<ScheduleSlotDto?> GetByIdAsync(int id)
        {
            return await BuildQuery().FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<ScheduleSlotDto> CreateAsync(CreateScheduleSlotDto dto)
        {
            var slot = new CoachScheduleSlot
            {
                CoachUserId     = dto.CoachUserId,
                CourseId        = dto.CourseId,
                DayOfWeek       = dto.DayOfWeek,
                StartTime       = dto.StartTime,
                EndTime         = dto.EndTime,
                MaxStudents     = dto.MaxStudents,
                CurrentStudents = 0,
                IsActive        = true,
                CreatedAt       = DateTime.UtcNow
            };

            _db.ScheduleSlots.Add(slot);
            await _db.SaveChangesAsync();
            return await ToDto(slot);
        }

        public async Task<ScheduleSlotDto?> UpdateAsync(int id, UpdateScheduleSlotDto dto)
        {
            var slot = await _db.ScheduleSlots.FindAsync(id);
            if (slot == null) return null;

            if (dto.DayOfWeek != null)      slot.DayOfWeek       = dto.DayOfWeek;
            if (dto.StartTime != null)      slot.StartTime       = dto.StartTime;
            if (dto.EndTime != null)        slot.EndTime         = dto.EndTime;
            if (dto.MaxStudents.HasValue)   slot.MaxStudents     = dto.MaxStudents.Value;
            if (dto.CurrentStudents.HasValue) slot.CurrentStudents = dto.CurrentStudents.Value;
            if (dto.IsActive.HasValue)      slot.IsActive        = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            return await ToDto(slot);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var slot = await _db.ScheduleSlots.FindAsync(id);
            if (slot == null) return false;

            _db.ScheduleSlots.Remove(slot);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<ScheduleSlotDto> BuildQuery()
        {
            return from s in _db.ScheduleSlots
                   join c in _db.Users on s.CoachUserId equals c.Id
                   orderby s.DayOfWeek, s.StartTime
                   select new ScheduleSlotDto
                   {
                       Id              = s.Id,
                       CoachUserId     = s.CoachUserId,
                       CoachName       = c.FirstName + " " + c.LastName,
                       CourseId        = s.CourseId,
                       CourseName      = null,
                       DayOfWeek       = s.DayOfWeek,
                       StartTime       = s.StartTime,
                       EndTime         = s.EndTime,
                       MaxStudents     = s.MaxStudents,
                       CurrentStudents = s.CurrentStudents,
                       IsActive        = s.IsActive,
                       CreatedAt       = s.CreatedAt
                   };
        }

        private async Task<ScheduleSlotDto> ToDto(CoachScheduleSlot s)
        {
            var coach  = await _db.Users.FindAsync(s.CoachUserId);
            var course = s.CourseId.HasValue ? await _db.Courses.FindAsync(s.CourseId.Value) : null;
            return new ScheduleSlotDto
            {
                Id              = s.Id,
                CoachUserId     = s.CoachUserId,
                CoachName       = coach != null ? $"{coach.FirstName} {coach.LastName}" : string.Empty,
                CourseId        = s.CourseId,
                CourseName      = course?.Name,
                DayOfWeek       = s.DayOfWeek,
                StartTime       = s.StartTime,
                EndTime         = s.EndTime,
                MaxStudents     = s.MaxStudents,
                CurrentStudents = s.CurrentStudents,
                IsActive        = s.IsActive,
                CreatedAt       = s.CreatedAt
            };
        }
    }
}
