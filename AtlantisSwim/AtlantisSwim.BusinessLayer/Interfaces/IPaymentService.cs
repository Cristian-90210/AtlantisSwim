using AtlantisSwim.Domain.Models.Payment;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IPaymentService
    {
        Task<List<PaymentDto>> GetByStudentAsync(int studentUserId);
        Task<PaymentResultDto> ProcessPaymentAsync(CreatePaymentDto dto);
    }
}
