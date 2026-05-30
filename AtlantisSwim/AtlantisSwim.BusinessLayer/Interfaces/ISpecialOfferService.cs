using AtlantisSwim.Domain.Models.Offers;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface ISpecialOfferService
    {
        Task<List<SpecialOfferDto>> GetAllAsync();
        Task<List<SpecialOfferDto>> GetByStudentAsync(int studentUserId);
        Task<SpecialOfferDto> CreateAsync(CreateSpecialOfferDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
