using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Booking;
using AtlantisSwim.Domain.Models.Booking;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class BookingService : IBookingService
    {
        private readonly DbSession _db;

        public BookingService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<BookingDto>> GetAllAsync()
        {
            return await BuildQuery().ToListAsync();
        }

        public async Task<List<BookingDto>> GetByStudentAsync(int studentUserId)
        {
            return await BuildQuery().Where(b => b.StudentUserId == studentUserId).ToListAsync();
        }

        public async Task<List<BookingDto>> GetByCoachAsync(int coachUserId)
        {
            return await BuildQuery().Where(b => b.CoachUserId == coachUserId).ToListAsync();
        }

        public async Task<BookingDto?> GetByIdAsync(int id)
        {
            return await BuildQuery().FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
        {
            var booking = new BookingData
            {
                StudentUserId = dto.StudentUserId,
                CoachUserId   = dto.CoachUserId,
                CourseId      = dto.CourseId,
                Date          = dto.Date.Date,
                Time          = dto.Time,
                Status        = "upcoming",
                CreatedAt     = DateTime.UtcNow
            };

            _db.Bookings.Add(booking);
            await _db.SaveChangesAsync();
            return await ToDto(booking);
        }

        public async Task<BookingDto?> UpdateStatusAsync(int id, string status)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null) return null;

            booking.Status = status;
            await _db.SaveChangesAsync();
            return await ToDto(booking);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null) return false;

            _db.Bookings.Remove(booking);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<BookingDto> BuildQuery()
        {
            return from b in _db.Bookings
                   join s in _db.Users on b.StudentUserId equals s.Id
                   join c in _db.Users on b.CoachUserId equals c.Id
                   join co in _db.Courses on b.CourseId equals co.Id
                   orderby b.Date descending
                   select new BookingDto
                   {
                       Id            = b.Id,
                       StudentUserId = b.StudentUserId,
                       StudentName   = s.FirstName + " " + s.LastName,
                       CoachUserId   = b.CoachUserId,
                       CoachName     = c.FirstName + " " + c.LastName,
                       CourseId      = b.CourseId,
                       CourseName    = co.Name,
                       Date          = b.Date,
                       Time          = b.Time,
                       Status        = b.Status,
                       CreatedAt     = b.CreatedAt
                   };
        }

        private async Task<BookingDto> ToDto(BookingData b)
        {
            var student = await _db.Users.FindAsync(b.StudentUserId);
            var coach   = await _db.Users.FindAsync(b.CoachUserId);
            var course  = await _db.Courses.FindAsync(b.CourseId);
            return new BookingDto
            {
                Id            = b.Id,
                StudentUserId = b.StudentUserId,
                StudentName   = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                CoachUserId   = b.CoachUserId,
                CoachName     = coach != null ? $"{coach.FirstName} {coach.LastName}" : string.Empty,
                CourseId      = b.CourseId,
                CourseName    = course?.Name ?? string.Empty,
                Date          = b.Date,
                Time          = b.Time,
                Status        = b.Status,
                CreatedAt     = b.CreatedAt
            };
        }
    }
}
