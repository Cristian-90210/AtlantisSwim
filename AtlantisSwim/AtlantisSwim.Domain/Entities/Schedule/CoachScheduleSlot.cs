using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Schedule
{
    public class CoachScheduleSlot
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int CoachUserId { get; set; }   // FK → Users.Id (coach)

        public int? CourseId { get; set; }     // FK → Courses.Id (optional)

        // "Monday" … "Sunday"
        [Required]
        [StringLength(10)]
        public string DayOfWeek { get; set; } = string.Empty;

        [Required]
        [StringLength(5)]
        public string StartTime { get; set; } = string.Empty;   // "HH:mm"

        [Required]
        [StringLength(5)]
        public string EndTime { get; set; } = string.Empty;     // "HH:mm"

        [Required]
        public int MaxStudents { get; set; }

        public int CurrentStudents { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
