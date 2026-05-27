using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Payment;
using AtlantisSwim.Domain.Entities.Subscription;
using AtlantisSwim.Domain.Models.Payment;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class PaymentService : IPaymentService
    {
        private readonly DbSession _db;

        public PaymentService(DbSession db)
        {
            _db = db;
        }

        public async Task<List<PaymentDto>> GetByStudentAsync(int studentUserId)
        {
            return await _db.Payments
                .Where(p => p.StudentUserId == studentUserId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => ToDto(p))
                .ToListAsync();
        }

        /// <summary>
        /// Simulated payment processor abstraction.
        /// In production: replace SimulateGateway with a real Stripe/PayPal call.
        /// </summary>
        public async Task<PaymentResultDto> ProcessPaymentAsync(CreatePaymentDto dto)
        {
            // Expire old active subscriptions
            var activeSubscriptions = await _db.Subscriptions
                .Where(s => s.StudentUserId == dto.StudentUserId && s.Status == "active")
                .ToListAsync();
            foreach (var sub in activeSubscriptions)
                sub.Status = "expired";

            // 1. Create payment record (pending)
            var payment = new PaymentData
            {
                StudentUserId = dto.StudentUserId,
                Amount        = dto.Amount,
                Method        = dto.Method,
                Status        = "pending",
                CreatedAt     = DateTime.UtcNow
            };
            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            // 2. Simulate gateway call (replace with real gateway in production)
            var gatewayRef = SimulateGateway(dto.Amount, dto.CardHolderName);
            bool gatewaySuccess = gatewayRef != null;

            if (!gatewaySuccess)
            {
                payment.Status = "failed";
                await _db.SaveChangesAsync();
                return new PaymentResultDto { IsSuccess = false, Message = "Payment gateway rejected the transaction." };
            }

            // 3. Mark payment completed
            payment.Status               = "completed";
            payment.TransactionReference = gatewayRef;
            payment.CompletedAt          = DateTime.UtcNow;

            // 4. Create subscription
            var startDate  = DateTime.UtcNow.Date;
            var expiryDate = startDate.AddMonths(1);

            var subscription = new SubscriptionData
            {
                StudentUserId = dto.StudentUserId,
                ServiceId     = dto.ServiceId,
                PlanName      = dto.PlanName,
                AmountPaid    = dto.Amount,
                SessionsTotal = dto.SessionsTotal,
                SessionsUsed  = 0,
                StartDate     = startDate,
                ExpiryDate    = expiryDate,
                Status        = "active",
                CreatedAt     = DateTime.UtcNow
            };
            _db.Subscriptions.Add(subscription);
            await _db.SaveChangesAsync();

            payment.SubscriptionId = subscription.Id;
            await _db.SaveChangesAsync();

            return new PaymentResultDto
            {
                IsSuccess            = true,
                Message              = "Payment processed successfully. Subscription activated.",
                PaymentId            = payment.Id,
                SubscriptionId       = subscription.Id,
                TransactionReference = gatewayRef
            };
        }

        /// <summary>
        /// Simulated gateway — always succeeds for valid amounts.
        /// Replace with real Stripe.ChargeAsync() or similar.
        /// </summary>
        private static string? SimulateGateway(decimal amount, string cardHolder)
        {
            if (amount <= 0 || string.IsNullOrWhiteSpace(cardHolder))
                return null;

            return $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        }

        private static PaymentDto ToDto(PaymentData p) => new()
        {
            Id                   = p.Id,
            StudentUserId        = p.StudentUserId,
            SubscriptionId       = p.SubscriptionId,
            Amount               = p.Amount,
            Method               = p.Method,
            Status               = p.Status,
            TransactionReference = p.TransactionReference,
            CreatedAt            = p.CreatedAt,
            CompletedAt          = p.CompletedAt
        };
    }
}
