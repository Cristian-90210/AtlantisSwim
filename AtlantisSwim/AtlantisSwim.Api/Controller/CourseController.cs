using AtlantisSwim.DataAccess;
using AtlantisSwim.Domain.Entities.Course;
using AtlantisSwim.Domain.Models.Course;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/course")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly DbSession _db;

        public CourseController(DbSession db)
        {
            _db = db;
        }

        // GET /api/course/getAll
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _db.Courses
                .Include(c => c.Level)
                .Include(c => c.Imgs)
                .Select(c => new CourseDto
                {
                    Id          = c.Id,
                    Name        = c.Name,
                    Description = c.Description,
                    Imgs        = c.Imgs,
                    Price       = c.Price,
                    Capacity    = c.Capacity,
                    Enrolled    = c.Enrolled,
                    Schedule    = c.Schedule,
                    Level       = c.Level
                })
                .ToListAsync();

            return Ok(courses);
        }

        // GET /api/course/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _db.Courses
                .Include(x => x.Level)
                .Include(x => x.Imgs)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (c == null) return NotFound();

            return Ok(new CourseDto
            {
                Id          = c.Id,
                Name        = c.Name,
                Description = c.Description,
                Imgs        = c.Imgs,
                Price       = c.Price,
                Capacity    = c.Capacity,
                Enrolled    = c.Enrolled,
                Schedule    = c.Schedule,
                Level       = c.Level
            });
        }

        // GET /api/course/levels
        [HttpGet("levels")]
        public async Task<IActionResult> GetLevels()
        {
            var levels = await _db.CourseLevels.ToListAsync();
            return Ok(levels);
        }

        // POST /api/course
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var level = await _db.CourseLevels.FindAsync(dto.LevelId);
            if (level == null)
                return BadRequest(new { message = $"Level with id {dto.LevelId} not found." });

            var course = new CourseData
            {
                Name        = dto.Name,
                Description = dto.Description,
                Price       = dto.Price,
                Capacity    = dto.Capacity,
                Enrolled    = 0,
                Schedule    = dto.Schedule,
                LevelId     = dto.LevelId,
                Imgs        = new List<CourseImg>(),
                CreatedAt   = DateTime.UtcNow,
                UpdatedAt   = DateTime.UtcNow
            };

            _db.Courses.Add(course);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = course.Id }, course.Id);
        }

        // PUT /api/course/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var course = await _db.Courses.FindAsync(id);
            if (course == null) return NotFound();

            if (dto.LevelId != course.LevelId)
            {
                var level = await _db.CourseLevels.FindAsync(dto.LevelId);
                if (level == null)
                    return BadRequest(new { message = $"Level with id {dto.LevelId} not found." });
            }

            course.Name        = dto.Name;
            course.Description = dto.Description;
            course.Price       = dto.Price;
            course.Capacity    = dto.Capacity;
            course.Schedule    = dto.Schedule;
            course.LevelId     = dto.LevelId;
            course.UpdatedAt   = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { id = course.Id });
        }

        // DELETE /api/course/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var course = await _db.Courses
                .Include(c => c.Imgs)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null) return NotFound();

            _db.CourseImgs.RemoveRange(course.Imgs);
            _db.Courses.Remove(course);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
