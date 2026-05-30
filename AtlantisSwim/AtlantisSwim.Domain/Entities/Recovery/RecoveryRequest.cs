using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Recovery
{
    public class RecoveryRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student requesting recovery)

        public int? CoachUserId { get; set; }    // FK → Users.Id (coach who confirms)

        // The desired date for the recovery session
        [Required]
        public DateTime Date { get; set; }

        // "Pending", "Confirmed", "Cancelled"
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}
