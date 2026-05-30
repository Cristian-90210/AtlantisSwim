using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Health;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/health-flags")]
    [ApiController]
    [Authorize]
    public class HealthFlagController : ControllerBase
    {
        private readonly IHealthFlagService _service;

        public HealthFlagController(IHealthFlagService service)
        {
            _service = service;
        }

        // GET /api/health-flags?studentId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId)
        {
            if (studentId.HasValue)
                return Ok(await _service.GetByStudentAsync(studentId.Value));
            return Ok(await _service.GetAllAsync());
        }

        // POST /api/health-flags — Coach or Admin
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateHealthFlagDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // PUT /api/health-flags/{id} — Coach or Admin
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateHealthFlagDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // DELETE /api/health-flags/{id} — Admin only
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
