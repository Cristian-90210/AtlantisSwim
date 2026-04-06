using AtlantisSwim.Domain.Models.User;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IUserLoginAction
    {
        public object UserLoginDataValidation(UserLoginDto udata);
    }
}
