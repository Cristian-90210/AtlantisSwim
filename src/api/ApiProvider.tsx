import { createContext, useContext } from 'react';
import axiosInstance from './axiosInstance';
import type { AxiosInstance } from 'axios';

const ApiContext = createContext<AxiosInstance>(axiosInstance);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => (
  <ApiContext.Provider value={axiosInstance}>
    {children}
  </ApiContext.Provider>
);

export const useAxios = () => useContext(ApiContext);
