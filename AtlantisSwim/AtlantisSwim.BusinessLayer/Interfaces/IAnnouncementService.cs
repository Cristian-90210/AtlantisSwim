using AtlantisSwim.Domain.Models.Announcement;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IAnnouncementService
    {
        Task<List<AnnouncementDto>> GetAllAsync(string? target = null);
        Task<AnnouncementDto?> GetByIdAsync(int id);
        Task<AnnouncementDto> CreateAsync(CreateAnnouncementDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
