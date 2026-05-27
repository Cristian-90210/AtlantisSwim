using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Booking
{
    public class BookingData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student)

        [Required]
        public int CoachUserId { get; set; }     // FK → Users.Id (coach)

        [Required]
        public int CourseId { get; set; }        // FK → Courses.Id

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(5)]
        public string Time { get; set; } = string.Empty;   // "HH:mm"

        // "upcoming", "completed", "cancelled"
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "upcoming";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
