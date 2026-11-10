import { apiClient } from '../api-client';
import { ENDPOINTS } from '@/app/api/constants/endpoints';
import type { DashboardData } from './types';

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiClient.get<any>(
      ENDPOINTS.DASHBOARD.GET_DATA
    );
    const res = response.data;
    if (res && typeof res === 'object') {
      if ('data' in res && res.data && typeof res.data === 'object') {
        return res.data;
      }
      if ('dashboard' in res && res.dashboard && typeof res.dashboard === 'object') {
        return res.dashboard;
      }
    }
    return res || {};
  },
};
