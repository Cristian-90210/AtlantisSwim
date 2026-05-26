using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Student;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/students")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        // GET api/students
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync();
            return Ok(students);
        }

        // GET api/students/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _studentService.GetByIdAsync(id);
            if (student == null)
                return NotFound(new { message = $"Student with id {id} was not found." });

            return Ok(student);
        }

        // POST api/students
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _studentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT api/students/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _studentService.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound(new { message = $"Student with id {id} was not found." });

            return Ok(updated);
        }

        // DELETE api/students/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _studentService.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Student with id {id} was not found." });

            return NoContent();
        }
    }
}
