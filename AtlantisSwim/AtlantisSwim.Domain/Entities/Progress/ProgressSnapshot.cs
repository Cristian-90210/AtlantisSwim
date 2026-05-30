using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Progress
{
    public class ProgressSnapshot
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student)

        public int? CoachUserId { get; set; }    // FK → Users.Id (coach who recorded)

        // e.g. "freestyle_technique", "water_confidence", "freestyle_speed"
        [Required]
        [StringLength(50)]
        public string MetricKey { get; set; } = string.Empty;

        // 0..100 percentage score
        [Required]
        [Range(0, 100)]
        public int MetricValue { get; set; }

        [Required]
        public DateTime RecordedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
