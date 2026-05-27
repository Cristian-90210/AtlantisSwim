using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/results")]
    [ApiController]
    [Authorize]
    public class SwimmingResultController : ControllerBase
    {
        private readonly ISwimmingResultService _service;

        public SwimmingResultController(ISwimmingResultService service)
        {
            _service = service;
        }

        // GET /api/results?studentId={id}&coachId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId, [FromQuery] int? coachId)
        {
            if (studentId.HasValue)
                return Ok(await _service.GetByStudentAsync(studentId.Value));

            if (coachId.HasValue)
                return Ok(await _service.GetByCoachAsync(coachId.Value));

            return Ok(await _service.GetAllAsync());
        }

        // POST /api/results — Coach only
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateSwimmingResultDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // PUT /api/results/{id} — Coach only
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSwimmingResultDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // DELETE /api/results/{id} — Admin only
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
