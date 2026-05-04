using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    // Self-registration is disabled — accounts are created by the admin via /api/users.
    [Route("api/reg")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        [HttpPost]
        public IActionResult Register()
        {
            return StatusCode(403, new { message = "Înregistrarea publică este dezactivată. Contactați administratorul." });
        }
    }
}
