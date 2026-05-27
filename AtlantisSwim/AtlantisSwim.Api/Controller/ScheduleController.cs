using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Schedule;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/schedule")]
    [ApiController]
    [Authorize]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _service;

        public ScheduleController(IScheduleService service)
        {
            _service = service;
        }

        // GET /api/schedule?coachId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? coachId)
        {
            if (coachId.HasValue)
                return Ok(await _service.GetByCoachAsync(coachId.Value));

            return Ok(await _service.GetAllAsync());
        }

        // GET /api/schedule/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var slot = await _service.GetByIdAsync(id);
            if (slot == null) return NotFound();
            return Ok(slot);
        }

        // POST /api/schedule — Coach or Admin
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateScheduleSlotDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var slot = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = slot.Id }, slot);
        }

        // PUT /api/schedule/{id} — Coach or Admin
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateScheduleSlotDto dto)
        {
            var slot = await _service.UpdateAsync(id, dto);
            if (slot == null) return NotFound();
            return Ok(slot);
        }

        // DELETE /api/schedule/{id} — Admin only
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
