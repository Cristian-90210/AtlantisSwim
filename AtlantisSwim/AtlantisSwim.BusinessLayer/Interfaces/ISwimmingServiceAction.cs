using AtlantisSwim.Domain.Models.SwimmingService;
using AtlantisSwim.Domain.Models.Responces;

namespace AtlantisSwim.BusinessLayer.Interfaces
{
    public interface ISwimmingServiceAction
    {
        List<SwimmingServiceDto> GetAllSwimmingServiceAction();
        SwimmingServiceDto? GetSwimmingServiceByIdAction(int id);
        ActionResponce CreateSwimmingServiceAction(SwimmingServiceDto data);
        ActionResponce UpdateSwimmingServiceAction(SwimmingServiceDto data);
        ActionResponce DeleteSwimmingServiceAction(int id);
    }
}
