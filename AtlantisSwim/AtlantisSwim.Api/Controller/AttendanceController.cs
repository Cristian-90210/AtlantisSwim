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

        // POST /api/attendance — Coach or Admin marks attendance
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
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
