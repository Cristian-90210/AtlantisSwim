using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace AtlantisSwim.Api.Controller
{
    [Route("api/session")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        internal IUserLoginAction _userAction;
        public AuthController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _userAction = bl.UserLoginAction();
        }

        [HttpPost("auth")]
        public IActionResult Auth([FromBody] UserLoginDto udata)
        {
            var response = _userAction.UserLoginDataValidation(udata);

            if (!response.IsSuccess)
                return Unauthorized(response);

            return Ok(response);
        }
    }
}
