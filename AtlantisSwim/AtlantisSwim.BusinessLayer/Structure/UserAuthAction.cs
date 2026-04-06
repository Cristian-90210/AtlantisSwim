using AtlantisSwim.BusinessLayer.Core;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.User;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class UserAuthAction : UserActions, IUserLoginAction
    {
        public UserAuthAction() { }

        public object UserLoginDataValidation(UserLoginDto udata)
        {

            var isValid = UserLoginDataValidationExecution(udata);
            if (isValid)
            {
                var token = UserTokenGeneration(udata);

            }

            return null;
        }
    }
}
