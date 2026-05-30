namespace AtlantisSwim.Domain.Models.Progress
{
    public class ProgressSnapshotDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int? CoachUserId { get; set; }
        public string? CoachName { get; set; }
        public string MetricKey { get; set; } = string.Empty;
        public int MetricValue { get; set; }
        public DateTime RecordedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProgressSnapshotDto
    {
        public int StudentUserId { get; set; }
        public int? CoachUserId { get; set; }
        public string MetricKey { get; set; } = string.Empty;
        public int MetricValue { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
