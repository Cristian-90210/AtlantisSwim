using AtlantisSwim.Domain.Entities.Course;

namespace AtlantisSwim.Domain.Models.Course
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<CourseImg> Imgs { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int Enrolled { get; set; }
        public string Schedule { get; set; }
        public CourseLevelData Level { get; set; }
    }
}
