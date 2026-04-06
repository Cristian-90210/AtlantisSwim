using AtlantisSwim.Domain.Models.Responces;
using AtlantisSwim.Domain.Models.User;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface IUserRegAction
    {
        public ActionResponce UserRegDataValidation(UserRegisterDto uReg);
    }
}
