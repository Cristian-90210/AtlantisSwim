using AtlantisSwim.Domain.Models.Attendance;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IAttendanceService
    {
        Task<List<AttendanceDto>> GetAllAsync();
        Task<List<AttendanceDto>> GetByUserAsync(int userId);
        Task<List<AttendanceDto>> GetByCourseAsync(int courseId);
        Task<AttendanceDto> CreateAsync(CreateAttendanceDto dto);
        Task<AttendanceDto?> UpdateAsync(int id, UpdateAttendanceDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
