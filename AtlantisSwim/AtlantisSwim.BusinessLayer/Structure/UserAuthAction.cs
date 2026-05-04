using AtlantisSwim.BusinessLayer.Core;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Entities.User;
using AtlantisSwim.Domain.Models.Responces;
using AtlantisSwim.Domain.Models.User;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class UserAuthAction : UserActions, IUserLoginAction
    {
        public UserAuthAction() { }

        public ActionResponce UserLoginDataValidation(UserLoginDto udata)
        {
            var user = UserLoginDataValidationExecution(udata);

            if (user == null)
                return new ActionResponce { IsSuccess = false, Message = "Invalid credentials" };

            var token = UserTokenGeneration(user);

            return new ActionResponce
            {
                IsSuccess = true,
                Message   = "Login successful",
                Data      = new UserAuthResponseDto
                {
                    Id        = user.Id,
                    UserName  = user.UserName,
                    FirstName = user.FirstName,
                    LastName  = user.LastName,
                    Email     = user.Email,
                    RoleId    = (int)user.Role,
                    RoleName  = user.Role switch
                    {
                        UserRole.Student => "Elev",
                        UserRole.Coach   => "Antrenor",
                        UserRole.Admin   => "Admin",
                        _                => user.Role.ToString()
                    },
                    Token = token
                }
            };
        }
    }
}
