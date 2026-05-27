using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Subscription;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/subscriptions")]
    [ApiController]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _service;

        public SubscriptionController(ISubscriptionService service)
        {
            _service = service;
        }

        // GET /api/subscriptions?studentId={id}&all=true
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? studentId, [FromQuery] bool all = false)
        {
            if (studentId.HasValue)
            {
                if (all)
                    return Ok(await _service.GetAllByStudentAsync(studentId.Value));

                var active = await _service.GetActiveByStudentAsync(studentId.Value);
                return Ok(active);
            }

            return Ok(await _service.GetAllAsync());
        }

        // POST /api/subscriptions — internal use (called by payment service or admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var subscription = await _service.CreateAsync(dto);
            return Ok(subscription);
        }
    }
}
