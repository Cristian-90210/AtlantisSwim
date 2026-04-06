using AtlantisSwim.Domain.Models.Course;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface ICourseAction
    {
        List<CourseDto> GetAllCoursesAction();
    }
}
