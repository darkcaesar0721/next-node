import { PackageResponse } from '@/models/package';
import axiosClient from './axiosClient';

const packageApi = {
  getAll(params: any): Promise<PackageResponse> {
    return axiosClient.get(`/celtic/packages`, { params });
  },
};

export default packageApi;
