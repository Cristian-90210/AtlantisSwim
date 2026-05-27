using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/payments")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _service;

        public PaymentController(IPaymentService service)
        {
            _service = service;
        }

        // GET /api/payments?studentId={id}
        [HttpGet]
        public async Task<IActionResult> GetByStudent([FromQuery] int studentId)
        {
            return Ok(await _service.GetByStudentAsync(studentId));
        }

        // POST /api/payments/process — process checkout payment
        [HttpPost("process")]
        public async Task<IActionResult> Process([FromBody] CreatePaymentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _service.ProcessPaymentAsync(dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
