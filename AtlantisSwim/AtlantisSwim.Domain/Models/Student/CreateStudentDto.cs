using System.ComponentModel.DataAnnotations;

namespace AtlantisSwim.Domain.Models.Student
{
    public class CreateStudentDto
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [StringLength(20)]
        public string SwimmingLevel { get; set; } = "Beginner";
    }
}
