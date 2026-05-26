using AtlantisSwim.Domain.Models.Responces;
using AtlantisSwim.Domain.Models.User;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IUserLoginAction
    {
        public ActionResponce UserLoginDataValidation(UserLoginDto udata);
    }
}
