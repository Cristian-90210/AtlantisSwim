import axiosInstance from '../axiosInstance';

export interface SwimmingServiceDto {
  id: number;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
}

export const getSwimmingServices = async (): Promise<SwimmingServiceDto[]> => {
  const res = await axiosInstance.get('/swimming-service/getAll');
  return res.data;
};

export const getSwimmingServiceById = async (id: number): Promise<SwimmingServiceDto> => {
  const res = await axiosInstance.get(`/swimming-service?id=${id}`);
  return res.data;
};

export const createSwimmingService = async (data: Omit<SwimmingServiceDto, 'id'>) => {
  const res = await axiosInstance.post('/swimming-service', data);
  return res.data;
};

export const updateSwimmingService = async (data: SwimmingServiceDto) => {
  const res = await axiosInstance.put('/swimming-service', data);
  return res.data;
};

export const deleteSwimmingService = async (id: number) => {
  const res = await axiosInstance.delete(`/swimming-service?id=${id}`);
  return res.data;
};
