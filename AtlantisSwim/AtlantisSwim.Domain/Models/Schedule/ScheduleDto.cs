namespace AtlantisSwim.Domain.Models.Schedule
{
    public class ScheduleSlotDto
    {
        public int Id { get; set; }
        public int CoachUserId { get; set; }
        public string CoachName { get; set; } = string.Empty;
        public int? CourseId { get; set; }
        public string? CourseName { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int MaxStudents { get; set; }
        public int CurrentStudents { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateScheduleSlotDto
    {
        public int CoachUserId { get; set; }
        public int? CourseId { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int MaxStudents { get; set; }
    }

    public class UpdateScheduleSlotDto
    {
        public string? DayOfWeek { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public int? MaxStudents { get; set; }
        public int? CurrentStudents { get; set; }
        public bool? IsActive { get; set; }
    }
}
