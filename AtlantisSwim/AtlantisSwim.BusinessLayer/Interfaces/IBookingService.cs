using AtlantisSwim.Domain.Models.Booking;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IBookingService
    {
        Task<List<BookingDto>> GetAllAsync();
        Task<List<BookingDto>> GetByStudentAsync(int studentUserId);
        Task<List<BookingDto>> GetByCoachAsync(int coachUserId);
        Task<BookingDto?> GetByIdAsync(int id);
        Task<BookingDto> CreateAsync(CreateBookingDto dto);
        Task<BookingDto?> UpdateStatusAsync(int id, string status);
        Task<bool> DeleteAsync(int id);
    }
}
