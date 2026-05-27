namespace AtlantisSwim.Domain.Models.Booking
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int CoachUserId { get; set; }
        public string CoachName { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBookingDto
    {
        public int StudentUserId { get; set; }
        public int CoachUserId { get; set; }
        public int CourseId { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
    }

    public class UpdateBookingStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
