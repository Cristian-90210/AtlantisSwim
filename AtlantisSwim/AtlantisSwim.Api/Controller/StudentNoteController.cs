using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Notes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/notes")]
    [ApiController]
    [Authorize]
    public class StudentNoteController : ControllerBase
    {
        private readonly IStudentNoteService _service;

        public StudentNoteController(IStudentNoteService service)
        {
            _service = service;
        }

        // GET /api/notes?studentId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId)
        {
            if (studentId.HasValue)
                return Ok(await _service.GetByStudentAsync(studentId.Value));
            return Ok(await _service.GetAllAsync());
        }

        // POST /api/notes — Coach or Admin
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateStudentNoteDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // DELETE /api/notes/{id} — Admin only
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
