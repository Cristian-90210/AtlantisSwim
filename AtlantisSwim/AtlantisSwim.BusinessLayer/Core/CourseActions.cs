using AtlantisSwim.Domain.Entities.Course;
using AtlantisSwim.Domain.Models.Course;

namespace AtlantisSwim.BusinessLayer.Core
{
    public class CourseActions
    {
        public CourseActions() { }

        internal List<CourseDto> GetAllCoursesActionExecution()
        {
            var courses = new List<CourseDto>();

            var course = new CourseDto()
            {
                Id = 1,
                Name = "Adult Freestyle Beginner",
                Description = "Learn the basics of freestyle swimming.",
                Imgs = new List<CourseImg>()
                {
                    new CourseImg() { Id = 1, ImgUrl = "https://example.com/freestyle-1.jpg" }
                },
                Price = 99.99m,
                Capacity = 15,
                Enrolled = 5,
                Schedule = "Mon, Wed 18:00",
                Level = new CourseLevelData() { Id = 1, Name = "Beginner" }
            };


            courses.Add(course);
            return courses;
        }
    }
}
