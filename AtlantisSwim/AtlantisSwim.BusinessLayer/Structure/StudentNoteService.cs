using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Notes;
using AtlantisSwim.Domain.Models.Notes;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class StudentNoteService : IStudentNoteService
    {
        private readonly DbSession _db;

        public StudentNoteService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<StudentNoteDto>> GetAllAsync() =>
            await BuildQuery().ToListAsync();

        public async Task<List<StudentNoteDto>> GetByStudentAsync(int studentUserId) =>
            await BuildQuery().Where(n => n.StudentUserId == studentUserId).ToListAsync();

        public async Task<StudentNoteDto> CreateAsync(CreateStudentNoteDto dto)
        {
            var note = new StudentNote
            {
                StudentUserId = dto.StudentUserId,
                AuthorUserId  = dto.AuthorUserId,
                Content       = dto.Content,
                CreatedAt     = DateTime.UtcNow
            };
            _db.StudentNotes.Add(note);
            await _db.SaveChangesAsync();
            return await ToDto(note);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var note = await _db.StudentNotes.FindAsync(id);
            if (note == null) return false;
            _db.StudentNotes.Remove(note);
            await _db.SaveChangesAsync();
            return true;
        }

        private IQueryable<StudentNoteDto> BuildQuery() =>
            from n in _db.StudentNotes
            join s in _db.Users on n.StudentUserId equals s.Id
            join a in _db.Users on n.AuthorUserId  equals a.Id
            orderby n.CreatedAt descending
            select new StudentNoteDto
            {
                Id            = n.Id,
                StudentUserId = n.StudentUserId,
                StudentName   = s.FirstName + " " + s.LastName,
                AuthorUserId  = n.AuthorUserId,
                AuthorName    = a.FirstName + " " + a.LastName,
                Content       = n.Content,
                CreatedAt     = n.CreatedAt
            };

        private async Task<StudentNoteDto> ToDto(StudentNote n)
        {
            var student = await _db.Users.FindAsync(n.StudentUserId);
            var author  = await _db.Users.FindAsync(n.AuthorUserId);
            return new StudentNoteDto
            {
                Id            = n.Id,
                StudentUserId = n.StudentUserId,
                StudentName   = student != null ? $"{student.FirstName} {student.LastName}" : string.Empty,
                AuthorUserId  = n.AuthorUserId,
                AuthorName    = author  != null ? $"{author.FirstName} {author.LastName}"   : string.Empty,
                Content       = n.Content,
                CreatedAt     = n.CreatedAt
            };
        }
    }
}
