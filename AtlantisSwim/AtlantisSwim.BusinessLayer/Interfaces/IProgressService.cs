using AtlantisSwim.Domain.Models.Progress;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IProgressService
    {
        Task<List<ProgressSnapshotDto>> GetAllAsync();
        Task<List<ProgressSnapshotDto>> GetByStudentAsync(int studentUserId);
        Task<List<ProgressSnapshotDto>> GetLatestByStudentAsync(int studentUserId);
        Task<ProgressSnapshotDto> CreateAsync(CreateProgressSnapshotDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
