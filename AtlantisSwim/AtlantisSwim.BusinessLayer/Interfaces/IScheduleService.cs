using AtlantisSwim.Domain.Models.Schedule;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IScheduleService
    {
        Task<List<ScheduleSlotDto>> GetAllAsync();
        Task<List<ScheduleSlotDto>> GetByCoachAsync(int coachUserId);
        Task<ScheduleSlotDto?> GetByIdAsync(int id);
        Task<ScheduleSlotDto> CreateAsync(CreateScheduleSlotDto dto);
        Task<ScheduleSlotDto?> UpdateAsync(int id, UpdateScheduleSlotDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
