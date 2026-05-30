using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Recovery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/recovery-requests")]
    [ApiController]
    [Authorize]
    public class RecoveryRequestController : ControllerBase
    {
        private readonly IRecoveryRequestService _service;

        public RecoveryRequestController(IRecoveryRequestService service)
        {
            _service = service;
        }

        // GET /api/recovery-requests?studentId={id}&coachId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId, [FromQuery] int? coachId)
        {
            if (studentId.HasValue)
                return Ok(await _service.GetByStudentAsync(studentId.Value));
            if (coachId.HasValue)
                return Ok(await _service.GetByCoachAsync(coachId.Value));
            return Ok(await _service.GetAllAsync());
        }

        // POST /api/recovery-requests — Student, Coach, or Admin
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRecoveryRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // PUT /api/recovery-requests/{id} — Coach or Admin (confirm/cancel)
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRecoveryRequestDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // DELETE /api/recovery-requests/{id} — Admin only
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
