namespace AtlantisSwim.Domain.Models.Health
{
    public class HealthFlagDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int CreatedByUserId { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string ProtocolText { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateHealthFlagDto
    {
        public int StudentUserId { get; set; }
        public int CreatedByUserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Severity { get; set; } = "medium";
        public string ProtocolText { get; set; } = string.Empty;
    }

    public class UpdateHealthFlagDto
    {
        public string? Severity { get; set; }
        public string? ProtocolText { get; set; }
        public bool? IsActive { get; set; }
    }
}
