using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Health
{
    public class StudentHealthFlag
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student)

        [Required]
        public int CreatedByUserId { get; set; } // FK → Users.Id (coach/admin)

        // e.g. "asthma", "chlorine_allergy", "other"
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty;

        // "low", "medium", "high"
        [Required]
        [StringLength(20)]
        public string Severity { get; set; } = "medium";

        [Required]
        [StringLength(500)]
        public string ProtocolText { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
