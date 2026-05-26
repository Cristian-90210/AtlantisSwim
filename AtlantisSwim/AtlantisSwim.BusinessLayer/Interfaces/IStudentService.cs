using AtlantisSwim.Domain.Models.Student;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IStudentService
    {
        Task<List<StudentDto>> GetAllAsync();
        Task<StudentDto?> GetByIdAsync(int id);
        Task<StudentDto> CreateAsync(CreateStudentDto dto);
        Task<StudentDto?> UpdateAsync(int id, CreateStudentDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
