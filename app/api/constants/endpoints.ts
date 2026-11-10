export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: {
    GET_DATA: '/dashboard',
  },
  ORDERS: {
   GET_ALL: '/adminOrders',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id: string) => `/products/${id}`,
  },
} as const;