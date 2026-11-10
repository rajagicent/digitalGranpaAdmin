import { apiClient } from '../api-client';
import { ENDPOINTS } from '@/app/api/constants/endpoints';
import type { OrderItem, PaginationParams, ProductsResponse } from './types';

export const productsApi = {
  async getProducts(params?: PaginationParams): Promise<ProductsResponse> {
    const response = await apiClient.get<any>(
      ENDPOINTS.PRODUCTS.GET_ALL,
      {
        params,
      }
    );
    const res = response.data;
    if (res && typeof res === 'object') {
      if ('data' in res && res.data && typeof res.data === 'object' && !Array.isArray(res.data) && ('productPaginatedResult' in res.data || 'products' in res.data || 'data' in res.data)) {
        return res.data;
      }
    }
    return res || {};
  },

  async getProductById(id: string): Promise<OrderItem> {
    const response = await apiClient.get<any>(
      ENDPOINTS.PRODUCTS.GET_BY_ID(id)
    );
    const res = response.data;
    if (res && typeof res === 'object' && 'data' in res && res.data) {
      return res.data;
    }
    return res;
  },
};

