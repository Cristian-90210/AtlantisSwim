namespace AtlantisSwim.Domain.Models.Recovery
{
    public class RecoveryCreditDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int? SourceAttendanceId { get; set; }
        // "active", "consumed", "expired"
        public string Status { get; set; } = "active";
        public int? ConsumedByBookingId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateRecoveryCreditDto
    {
        public int StudentUserId { get; set; }
        public int? SourceAttendanceId { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public class UpdateRecoveryCreditDto
    {
        public string? Status { get; set; }
        public int? ConsumedByBookingId { get; set; }
    }
}
