namespace AtlantisSwim.Domain.Entities.Course
{
    public class CourseData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<CourseImg> Imgs { get; set; }

        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int Enrolled { get; set; }
        public string Schedule { get; set; } // e.g. "Mon, Wed 18:00"

        public CourseLevelData Level { get; set; }

        /// <summary>
        /// The date and time when the course was created.
        /// </summary>
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
