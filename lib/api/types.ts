export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface Personalization {
  personalization_id?: string;
  id?: string;
  order_id?: string;
  forWhom?: string;
  status?: string;
  personalizeStatus?: string | boolean;
  uploadedImage?: string;
  previewImage?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface OrderItem {
  item_id?: string;
  id?: string;
  _id?: string;
  title: string;
  price: number | string;
  quantity?: number;
  sku?: string;
  variantTitle?: string;
  productExists?: boolean;
  image?: string;
  fulfillmentStatus?: string;
  vendor?: string;
  fulfillmentService?: string;
  order_id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Order {
  order_id: string;
  orderNumber?: string | number;
  email?: string;
  contactEmail?: string;
  shopifyCustomerId?: string;
  totalAmount?: number | string;
  subtotal?: number | string;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  financialStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  order_items?: OrderItem[];
  personalizations?: Personalization[];
  [key: string]: any;
}

export interface OrdersResponse {
  orderPaginatedResult?: {
    data: Order[];
    pagination: PaginationMeta;
  };
  totalPendingPersonalizations?: number;
  totalOrders?: number;
  data?: Order[];
  pagination?: PaginationMeta;
  [key: string]: any;
}

export interface ProductsResponse {
  productPaginatedResult?: {
    data: OrderItem[];
    pagination: PaginationMeta;
  };
  data?: OrderItem[];
  pagination?: PaginationMeta;
  [key: string]: any;
}

export interface DashboardData {
  totalOrders?: number;
  totalPendingPersonalizations?: number;
  totalPersonalizations?: number;
  orderDetails?: Order[];
  [key: string]: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  };
  admin?: {
    id?: string;
    email?: string;
  };
  message?: string;
  error?: string;
  success?: boolean;
  [key: string]: any;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  success?: boolean;
  [key: string]: any;
}

