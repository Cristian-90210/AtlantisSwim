using AtlantisSwim.Domain.Models.Notes;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IStudentNoteService
    {
        Task<List<StudentNoteDto>> GetAllAsync();
        Task<List<StudentNoteDto>> GetByStudentAsync(int studentUserId);
        Task<StudentNoteDto> CreateAsync(CreateStudentNoteDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
