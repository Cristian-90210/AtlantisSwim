using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Recovery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/recovery-credits")]
    [ApiController]
    [Authorize]
    public class RecoveryCreditController : ControllerBase
    {
        private readonly IRecoveryCreditService _service;

        public RecoveryCreditController(IRecoveryCreditService service)
        {
            _service = service;
        }

        // GET /api/recovery-credits?studentId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId)
        {
            if (studentId.HasValue)
                return Ok(await _service.GetByStudentAsync(studentId.Value));
            return Ok(await _service.GetAllAsync());
        }

        // POST /api/recovery-credits — Coach or Admin
        [HttpPost]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateRecoveryCreditDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // PUT /api/recovery-credits/{id} — Coach or Admin
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Coach,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRecoveryCreditDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // DELETE /api/recovery-credits/{id} — Admin only
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
