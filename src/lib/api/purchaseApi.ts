import axiosClient from "./axiosClient";

const purchaseApi = {
  postPurchase(params: any): Promise<any> {
    return axiosClient.post(`/purchases`, params);
  },
};

export default purchaseApi;
