namespace AtlantisSwim.Domain.Models.Recovery
{
    public class RecoveryRequestDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int? CoachUserId { get; set; }
        public string? CoachName { get; set; }
        public DateTime Date { get; set; }
        // "Pending", "Confirmed", "Cancelled"
        public string Status { get; set; } = "Pending";
        public string? Notes { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime RequestedAt { get; set; }
    }

    public class CreateRecoveryRequestDto
    {
        public int StudentUserId { get; set; }
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateRecoveryRequestDto
    {
        public string? Status { get; set; }
        public int? CoachUserId { get; set; }
    }
}
