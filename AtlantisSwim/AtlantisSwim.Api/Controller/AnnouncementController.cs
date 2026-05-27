using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Announcement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/announcements")]
    [ApiController]
    [Authorize]
    public class AnnouncementController : ControllerBase
    {
        private readonly IAnnouncementService _service;

        public AnnouncementController(IAnnouncementService service)
        {
            _service = service;
        }

        // GET /api/announcements?target=student
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? target)
        {
            return Ok(await _service.GetAllAsync(target));
        }

        // GET /api/announcements/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var announcement = await _service.GetByIdAsync(id);
            if (announcement == null) return NotFound();
            return Ok(announcement);
        }

        // POST /api/announcements — Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var announcement = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = announcement.Id }, announcement);
        }

        // DELETE /api/announcements/{id} — Admin only
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
