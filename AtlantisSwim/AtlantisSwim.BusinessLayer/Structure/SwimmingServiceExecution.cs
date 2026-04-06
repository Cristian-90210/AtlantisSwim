using AtlantisSwim.BusinessLayer.Core;
using AtlantisSwim.BusinessLayer.Interfaces;
using AtlantisSwim.Domain.Models.SwimmingService;
using AtlantisSwim.Domain.Models.Responces;

namespace AtlantisSwim.BusinessLayer.Structure
{
    public class SwimmingServiceExecution : SwimmingServiceActions, ISwimmingServiceAction
    {
        public ActionResponce CreateSwimmingServiceAction(SwimmingServiceDto data)
        {
            return CreateSwimmingServiceActionExecution(data);
        }

        public ActionResponce DeleteSwimmingServiceAction(int id)
        {
            return DeleteSwimmingServiceActionExecution(id);
        }

        public List<SwimmingServiceDto> GetAllSwimmingServiceAction()
        {
            return GetAllSwimmingServiceActionExecution();
        }

        public SwimmingServiceDto? GetSwimmingServiceByIdAction(int id)
        {
            return GetSwimmingServiceByIdActionExecution(id);
        }

        public ActionResponce UpdateSwimmingServiceAction(SwimmingServiceDto data)
        {
           return UpdateSwimmingServiceActionExecution(data);
        }
    }
}
