namespace AtlantisSwim.Domain.Models.Payment
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public int? SubscriptionId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? TransactionReference { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class CreatePaymentDto
    {
        public int StudentUserId { get; set; }
        public int ServiceId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int SessionsTotal { get; set; }
        public string Method { get; set; } = "card";
        // Card holder info (NOT card numbers — those stay in browser/gateway)
        public string CardHolderName { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
    }

    public class PaymentResultDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? PaymentId { get; set; }
        public int? SubscriptionId { get; set; }
        public string? TransactionReference { get; set; }
    }
}
