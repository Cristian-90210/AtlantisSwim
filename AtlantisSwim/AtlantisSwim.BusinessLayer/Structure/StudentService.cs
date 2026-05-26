using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Student;
using AtlantisSwim.Domain.Models.Student;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class StudentService : IStudentService
    {
        private readonly DbSession _db;

        public StudentService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<StudentDto>> GetAllAsync()
        {
            return await _db.Students
                .Where(s => s.IsActive)
                .Select(s => ToDto(s))
                .ToListAsync();
        }

        public async Task<StudentDto?> GetByIdAsync(int id)
        {
            var student = await _db.Students.FindAsync(id);
            return student == null ? null : ToDto(student);
        }

        public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
        {
            var student = new StudentData
            {
                FirstName = dto.FirstName,
                LastName  = dto.LastName,
                Email     = dto.Email,
                Phone     = dto.Phone,
                DateOfBirth   = dto.DateOfBirth,
                SwimmingLevel = dto.SwimmingLevel,
                IsActive  = true,
                EnrolledOn = DateTime.UtcNow
            };

            _db.Students.Add(student);
            await _db.SaveChangesAsync();

            return ToDto(student);
        }

        public async Task<StudentDto?> UpdateAsync(int id, CreateStudentDto dto)
        {
            var student = await _db.Students.FindAsync(id);
            if (student == null) return null;

            student.FirstName     = dto.FirstName;
            student.LastName      = dto.LastName;
            student.Email         = dto.Email;
            student.Phone         = dto.Phone;
            student.DateOfBirth   = dto.DateOfBirth;
            student.SwimmingLevel = dto.SwimmingLevel;

            await _db.SaveChangesAsync();
            return ToDto(student);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _db.Students.FindAsync(id);
            if (student == null) return false;

            student.IsActive = false; // soft delete — record is preserved
            await _db.SaveChangesAsync();
            return true;
        }

        // ── Mapping helper ────────────────────────────────────────────────────────
        private static StudentDto ToDto(StudentData s) => new()
        {
            Id            = s.Id,
            FirstName     = s.FirstName,
            LastName      = s.LastName,
            Email         = s.Email,
            Phone         = s.Phone,
            DateOfBirth   = s.DateOfBirth,
            SwimmingLevel = s.SwimmingLevel,
            IsActive      = s.IsActive,
            EnrolledOn    = s.EnrolledOn
        };
    }
}
