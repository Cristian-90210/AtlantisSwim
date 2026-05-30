using AtlantisSwim.Domain.Models.Health;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IHealthFlagService
    {
        Task<List<HealthFlagDto>> GetAllAsync();
        Task<List<HealthFlagDto>> GetByStudentAsync(int studentUserId);
        Task<HealthFlagDto> CreateAsync(CreateHealthFlagDto dto);
        Task<HealthFlagDto?> UpdateAsync(int id, UpdateHealthFlagDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
