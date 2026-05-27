namespace AtlantisSwim.Domain.Models.Results
{
    public class SwimmingResultDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int CoachUserId { get; set; }
        public string CoachName { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string Distance { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateSwimmingResultDto
    {
        public int StudentUserId { get; set; }
        public int CoachUserId { get; set; }
        public string Style { get; set; } = string.Empty;
        public string Distance { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string? Notes { get; set; }
    }
}
