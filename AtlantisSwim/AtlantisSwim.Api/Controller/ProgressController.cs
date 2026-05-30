using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Progress;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/progress")]
    [ApiController]
    [Authorize]
    public class ProgressController : ControllerBase
    {
        private readonly IProgressService _service;

        public ProgressController(IProgressService service)
        {
            _service = service;
        }

        // GET /api/progress?studentId={id}&latest=true
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId, [FromQuery] bool latest = false)
        {
            if (studentId.HasValue)
            {
                if (latest)
                    return Ok(await _service.GetLatestByStudentAsync(studentId.Value));
                return Ok(await _service.GetByStudentAsync(studentId.Value));
            }
            return Ok(await _service.GetAllAsync());
        }

        // POST /api/progress — Coach or Admin
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateProgressSnapshotDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // DELETE /api/progress/{id} — Admin only
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
