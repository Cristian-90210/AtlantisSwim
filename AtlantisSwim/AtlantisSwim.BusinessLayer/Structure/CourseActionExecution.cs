using AtlantisSwim.BusinessLayer.Core;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Course;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class CourseActionExecution : CourseActions, ICourseAction
    {
        public List<CourseDto> GetAllCoursesAction()
        {
            return GetAllCoursesActionExecution();
        }
    }
}
