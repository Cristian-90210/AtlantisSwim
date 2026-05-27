using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Results
{
    public class SwimmingResult
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student)

        [Required]
        public int CoachUserId { get; set; }     // FK → Users.Id (coach)

        // "freestyle", "backstroke", "breaststroke", "butterfly", "medley"
        [Required]
        [StringLength(30)]
        public string Style { get; set; } = string.Empty;

        // "25m", "50m", "100m", "200m", "400m"
        [Required]
        [StringLength(10)]
        public string Distance { get; set; } = string.Empty;

        // time in "mm:ss.ff" format
        [Required]
        [StringLength(15)]
        public string Time { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
