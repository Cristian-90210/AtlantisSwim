using System.Security.Claims;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Attendance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/attendance")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _service;

        public AttendanceController(IAttendanceService service)
        {
            _service = service;
        }

        // GET /api/attendance?userId={id}&courseId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? userId, [FromQuery] int? courseId)
        {
            if (userId.HasValue)
                return Ok(await _service.GetByUserAsync(userId.Value));

            if (courseId.HasValue)
                return Ok(await _service.GetByCourseAsync(courseId.Value));

            return Ok(await _service.GetAllAsync());
        }

        // POST /api/attendance — any authenticated user (students self-report, coaches/admins mark others)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAttendanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // PUT /api/attendance/{id} — update status / confirm
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAttendanceDto dto)
        {
            // When confirming, ensure confirmedByUserId matches the authenticated caller
            if (dto.Confirmed == true && dto.ConfirmedByUserId.HasValue)
            {
                var callerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (int.TryParse(callerIdStr, out int callerId) && callerId != dto.ConfirmedByUserId.Value)
                    return Forbid();
            }

            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // DELETE /api/attendance/{id} — Admin only
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
