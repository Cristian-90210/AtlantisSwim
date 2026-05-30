using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Offers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/offers")]
    [ApiController]
    [Authorize]
    public class SpecialOfferController : ControllerBase
    {
        private readonly ISpecialOfferService _service;

        public SpecialOfferController(ISpecialOfferService service)
        {
            _service = service;
        }

        // GET /api/offers?studentId={id}
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? studentId)
        {
            if (studentId.HasValue)
                return Ok(await _service.GetByStudentAsync(studentId.Value));
            return Ok(await _service.GetAllAsync());
        }

        // POST /api/offers — Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateSpecialOfferDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // DELETE /api/offers/{id} — Admin only
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
