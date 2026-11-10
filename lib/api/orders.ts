import { apiClient } from '../api-client';
import { ENDPOINTS } from '@/app/api/constants/endpoints';
import type { OrdersResponse, PaginationParams } from './types';

export const ordersApi = {
  async getOrders(params?: PaginationParams): Promise<OrdersResponse> {
    const response = await apiClient.get<any>(
      ENDPOINTS.ORDERS.GET_ALL,
      {
        params,
      }
    );
    const res = response.data;
    if (res && typeof res === 'object') {
      if ('data' in res && res.data && typeof res.data === 'object' && !Array.isArray(res.data) && ('orderPaginatedResult' in res.data || 'orders' in res.data || 'data' in res.data)) {
        return res.data;
      }
    }
    return res || {};
  },
};

