namespace AtlantisSwim.Domain.Models.Student
{
    public class StudentDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string SwimmingLevel { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime EnrolledOn { get; set; }
    }
}
