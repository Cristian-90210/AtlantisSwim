using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Recovery
{
    public class RecoveryCredit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }       // FK → Users.Id

        public int? SourceAttendanceId { get; set; } // FK → AttendanceRecords.Id

        // "active", "consumed", "expired"
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "active";

        public int? ConsumedByBookingId { get; set; } // FK → Bookings.Id

        [Required]
        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
