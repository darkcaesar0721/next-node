import { DestinationResponse } from '@/models/destination';
import axiosClient from './axiosClient';

const destinationApi = {
  getAll(params: any): Promise<DestinationResponse> {
    return axiosClient.get(`/celtic/destinations`, { params });
  },
};

export default destinationApi;
