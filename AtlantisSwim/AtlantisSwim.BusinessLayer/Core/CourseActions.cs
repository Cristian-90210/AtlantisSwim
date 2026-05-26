using AtlantisSwim.DataAccess.Context;
using AtlantisSwim.Domain.Models.Course;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.BusinessLayer.Core
{
    public class CourseActions
    {
        public CourseActions() { }

        internal List<CourseDto> GetAllCoursesActionExecution()
        {
            using (var db = new CourseContext())
            {
                return db.Courses
                    .Include(c => c.Level)
                    .Include(c => c.Imgs)
                    .Select(c => new CourseDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Imgs = c.Imgs,
                        Price = c.Price,
                        Capacity = c.Capacity,
                        Enrolled = c.Enrolled,
                        Schedule = c.Schedule,
                        Level = c.Level
                    })
                    .ToList();
            }
        }
    }
}
