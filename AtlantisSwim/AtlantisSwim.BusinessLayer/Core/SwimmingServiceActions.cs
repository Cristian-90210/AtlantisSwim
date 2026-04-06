using AtlantisSwim.Domain.Models.SwimmingService;
using System;
using System.Collections.Generic;
using System.Linq;
using AtlantisSwim.DataAccess.Context;
using AtlantisSwim.Domain.Entities.SwimmingService;
using AtlantisSwim.Domain.Models.Responces;

namespace AtlantisSwim.BusinessLayer.Core
{
    public class SwimmingServiceActions
    {
        protected SwimmingServiceActions()
        {
        }

        protected List<SwimmingServiceDto> GetAllSwimmingServiceActionExecution()
        {
            var data = new List<SwimmingServiceDto>();
            List<SwimmingServiceData> csData;
            using (var db = new SwimmingServiceContext())
            {
                csData = db.SwimmingServices.
                    Where(x => !x.IsDeleted).ToList();
            }


            if (csData.Count <= 0) return data;
            foreach (var item in csData)
            {
                data.Add(new SwimmingServiceDto
                {
                    Id = item.Id,
                    ServiceName = item.ServiceName,
                    ServiceDescription = item.ServiceDescription,
                    ServicePrice = item.ServicePrice
                });
            }

            return data;
        }

        protected SwimmingServiceDto? GetSwimmingServiceByIdActionExecution(int id)
        {
            SwimmingServiceData? csData;
            using (var db = new SwimmingServiceContext())
            {
                csData = db.SwimmingServices
                    .FirstOrDefault(x =>
                        x.Id == id && !x.IsDeleted);
            }

            if (csData == null) return null;
            var data = new SwimmingServiceDto
            {
                Id = csData.Id,
                ServiceName = csData.ServiceName,
                ServiceDescription = csData.ServiceDescription,
                ServicePrice = csData.ServicePrice
            };
            return data;
        }

        protected ActionResponce CreateSwimmingServiceActionExecution(SwimmingServiceDto data)
        {
            var status = ValidateSwimmingServiceName(data);
            if (!status.IsSuccess)
            {
                return status;
            }

            using (var db = new SwimmingServiceContext())
            {
                var csData = new SwimmingServiceData
                {
                    ServiceName = data.ServiceName,
                    ServiceDescription = data.ServiceDescription,
                    ServicePrice = data.ServicePrice,
                    CreatedAt = DateTime.Now
                };
                db.SwimmingServices.Add(csData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Swimming service created successfully."
            };
        }

        protected ActionResponce UpdateSwimmingServiceActionExecution(SwimmingServiceDto data)
        {

            var localData = GetSwimmingServiceByIdInternal(data.Id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Swimming service not found."
                };
            }

            localData.ServiceDescription = data.ServiceDescription;
            localData.ServiceName = data.ServiceName;
            localData.ServicePrice = data.ServicePrice;

            localData.UpdatedAt = DateTime.Now;


            using (var db = new SwimmingServiceContext())
            {
                db.SwimmingServices.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce
            {
                IsSuccess = true,
                Message = "Swimming service updated successfully."
            };
        }

        protected ActionResponce DeleteSwimmingServiceActionExecution(int id)
        {
            var localData = GetSwimmingServiceByIdInternal(id);
            if (localData == null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "Swimming service not found."
                };
            }


            localData.IsDeleted = true;

            using (var db = new SwimmingServiceContext())
            {
                db.SwimmingServices.Update(localData);
                db.SaveChanges();
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "Swimming Service Deleted"
            };
        }


        private SwimmingServiceData? GetSwimmingServiceByIdInternal(int id)
        {
            SwimmingServiceData? localData;
            using (var db = new SwimmingServiceContext())
            {
                localData = db.SwimmingServices.
                    FirstOrDefault(x => x.Id == id);
            }

            return localData;
        }

        private ActionResponce ValidateSwimmingServiceName(SwimmingServiceDto data)
        {
            SwimmingServiceData? localData;
            using (var db = new SwimmingServiceContext())
            {
                localData = db.SwimmingServices
                .FirstOrDefault(x =>
                        x.ServiceName.ToLower() == data.ServiceName.ToLower() && !x.IsDeleted);
            }

            if (localData != null)
            {
                return new ActionResponce
                {
                    IsSuccess = false,
                    Message = "A swimming service with the same name already exists."
                };
            }

            return new ActionResponce()
            {
                IsSuccess = true,
                Message = "A swimming service name is valid."
            };
        }
    }
}
