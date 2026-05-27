using AtlantisSwim.Domain.Models.Results;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface ISwimmingResultService
    {
        Task<List<SwimmingResultDto>> GetAllAsync();
        Task<List<SwimmingResultDto>> GetByStudentAsync(int studentUserId);
        Task<List<SwimmingResultDto>> GetByCoachAsync(int coachUserId);
        Task<SwimmingResultDto> CreateAsync(CreateSwimmingResultDto dto);
        Task<SwimmingResultDto?> UpdateAsync(int id, CreateSwimmingResultDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
