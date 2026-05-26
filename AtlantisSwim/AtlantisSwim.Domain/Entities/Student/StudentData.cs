using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AtlantisSwim.Domain.Entities.Student
{
    public class StudentData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [StringLength(20)]
        public string SwimmingLevel { get; set; } = "Beginner"; // Beginner / Intermediate / Advanced

        public bool IsActive { get; set; } = true;

        [DataType(DataType.Date)]
        public DateTime EnrolledOn { get; set; }
    }
}
