using AtlantisSwim.Domain.Models.Subscription;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface ISubscriptionService
    {
        Task<List<SubscriptionDto>> GetAllAsync();
        Task<SubscriptionDto?> GetActiveByStudentAsync(int studentUserId);
        Task<List<SubscriptionDto>> GetAllByStudentAsync(int studentUserId);
        Task<SubscriptionDto> CreateAsync(CreateSubscriptionDto dto);
        Task<bool> UseSessionAsync(int studentUserId);
    }
}
