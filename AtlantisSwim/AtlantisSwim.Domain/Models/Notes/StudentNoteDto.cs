namespace AtlantisSwim.Domain.Models.Notes
{
    public class StudentNoteDto
    {
        public int Id { get; set; }
        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int AuthorUserId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateStudentNoteDto
    {
        public int StudentUserId { get; set; }
        public int AuthorUserId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
