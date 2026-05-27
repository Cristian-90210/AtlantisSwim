namespace AtlantisSwim.Domain.Models.Attendance
{
    public class AttendanceDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? MarkedByUserId { get; set; }
        public bool Confirmed { get; set; }
        public int? ConfirmedByUserId { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateAttendanceDto
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; } = "Present";
        public int? MarkedByUserId { get; set; }
    }

    public class UpdateAttendanceDto
    {
        public string? Status { get; set; }
        public bool? Confirmed { get; set; }
        public int? ConfirmedByUserId { get; set; }
    }
}
