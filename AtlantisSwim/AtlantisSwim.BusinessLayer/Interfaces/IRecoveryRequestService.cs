using AtlantisSwim.Domain.Models.Recovery;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IRecoveryRequestService
    {
        Task<List<RecoveryRequestDto>> GetAllAsync();
        Task<List<RecoveryRequestDto>> GetByStudentAsync(int studentUserId);
        Task<List<RecoveryRequestDto>> GetByCoachAsync(int coachUserId);
        Task<RecoveryRequestDto> CreateAsync(CreateRecoveryRequestDto dto);
        Task<RecoveryRequestDto?> UpdateAsync(int id, UpdateRecoveryRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
