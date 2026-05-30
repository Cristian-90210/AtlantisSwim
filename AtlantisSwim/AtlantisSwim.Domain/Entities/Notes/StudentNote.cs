using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Notes
{
    public class StudentNote
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentUserId { get; set; }   // FK → Users.Id (student)

        [Required]
        public int AuthorUserId { get; set; }    // FK → Users.Id (coach/admin)

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
