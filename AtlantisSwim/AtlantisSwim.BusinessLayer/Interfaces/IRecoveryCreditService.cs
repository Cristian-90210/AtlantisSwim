using AtlantisSwim.Domain.Models.Recovery;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IRecoveryCreditService
    {
        Task<List<RecoveryCreditDto>> GetAllAsync();
        Task<List<RecoveryCreditDto>> GetByStudentAsync(int studentUserId);
        Task<RecoveryCreditDto> CreateAsync(CreateRecoveryCreditDto dto);
        Task<RecoveryCreditDto?> UpdateAsync(int id, UpdateRecoveryCreditDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
