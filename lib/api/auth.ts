import { apiClient } from '../api-client';
import { ENDPOINTS } from '@/app/api/constants/endpoints';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
} from './types';

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<any>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
    const res = response.data;
    if (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object') {
      return {
        ...res,
        ...res.data,
      };
    }
    return res || {};
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<any>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload
    );
    const res = response.data;
    if (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object') {
      return {
        ...res,
        ...res.data,
      };
    }
    return res || {};
  },
};
