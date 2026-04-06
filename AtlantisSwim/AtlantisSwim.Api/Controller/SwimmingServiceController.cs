using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.SwimmingService;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/swimming-service")]
    [ApiController]
    public class SwimmingServiceController : ControllerBase
    {
        private ISwimmingServiceAction _swimmingService;
        public SwimmingServiceController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _swimmingService = bl.SwimmingServiceAction();
        }

        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var services = _swimmingService.GetAllSwimmingServiceAction();
            return Ok(services);
        }

        [HttpGet]
        public IActionResult Get(int id)
        {
            var service = _swimmingService.GetSwimmingServiceByIdAction(id);
            if (service == null) return NotFound();
            return Ok(service);
        }

        [HttpPost]
        public IActionResult Create([FromBody] SwimmingServiceDto data)
        {
            var response = _swimmingService.CreateSwimmingServiceAction(data);
            return Ok(response);
        }

        [HttpPut]
        public IActionResult Update([FromBody] SwimmingServiceDto data)
        {
            var response = _swimmingService.UpdateSwimmingServiceAction(data);
            return Ok(response);
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var response = _swimmingService.DeleteSwimmingServiceAction(id);
            return Ok(response);
        }
    }
}
