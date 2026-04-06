using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.BusinessLayer.Structure;

namespace AtlantisSwim.BusinessLayer
{
    public class BusinessLogic
    {

        public BusinessLogic() { }


        public IUserLoginAction UserLoginAction()
        {
            return new UserAuthAction();
        }

        public ICourseAction CourseAction()
        {
            return new CourseActionExecution();
        }

        public IUserRegAction UserRegAction()
        {
            return new UserRegActionExecution();
        }

        public ISwimmingServiceAction SwimmingServiceAction()
        {
            return new SwimmingServiceExecution();
        }
    }
}
