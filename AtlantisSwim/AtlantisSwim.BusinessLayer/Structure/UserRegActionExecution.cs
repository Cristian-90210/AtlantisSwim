using AtlantisSwim.BusinessLayer.Core;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.Responces;
using AtlantisSwim.Domain.Models.User;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class UserRegActionExecution : UserActions, IUserRegAction
    {
        public ActionResponce UserRegDataValidation(UserRegisterDto uReg)
        {
            return UserRegDataValidationAction(uReg);
        }
    }
}
