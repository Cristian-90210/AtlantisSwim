namespace AtlantisSwim.Domain.Models.Subscription
{
    public class SubscriptionDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int ServiceId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
        public int SessionsTotal { get; set; }
        public int SessionsUsed { get; set; }
        public int SessionsRemaining => SessionsTotal - SessionsUsed;
        public DateTime StartDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateSubscriptionDto
    {
        public int StudentUserId { get; set; }
        public int ServiceId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
        public int SessionsTotal { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
