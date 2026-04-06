using AtlantisSwim.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/course")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        internal ICourseAction _course;
        public CourseController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _course = bl.CourseAction();
        }

        [HttpGet("getAll")]
        public IActionResult GetAllCourses()
        {
            var courses = _course.GetAllCoursesAction();
            return Ok(courses);
        }
    }
}
