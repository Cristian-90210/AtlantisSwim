using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Attendance
{
    public class AttendanceRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }       // FK → Users.Id (student)

        [Required]
        public int CourseId { get; set; }     // FK → Courses.Id

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        // "Present", "Absent", "AbsentMedical", "Recovery"
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Present";

        public int? MarkedByUserId { get; set; }   // FK → Users.Id (coach/admin who marked)

        public bool Confirmed { get; set; } = false;

        public int? ConfirmedByUserId { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
