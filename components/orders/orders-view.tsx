"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { Package, Clock3, Check, RefreshCw } from "lucide-react";
import { StatCard } from "../stat-card";
import { OrdersTable } from "./orders-table";
import { ordersApi, type Order, type PaginationMeta } from "@/lib/api";

export interface OrdersViewProps {
  onOpen: (order: Order) => void;
}

export const OrdersView = memo(function OrdersView({ onOpen }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [totalPending, setTotalPending] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    const targetPage = Math.max(1, Number(page) || 1);
    try {
      const response = await ordersApi.getOrders({ page: targetPage, limit: 10 });
      const ordersList: Order[] =
        response?.orderPaginatedResult?.data ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray((response as any)?.orders) ? (response as any).orders : null) ||
        (Array.isArray(response) ? (response as unknown as Order[]) : []) ||
        [];

      const rawPagination: any =
        response?.orderPaginatedResult?.pagination ||
        response?.pagination ||
        (response as any)?.meta ||
        (response as any)?.orderPaginatedResult;

      const currentPage =
        Number(rawPagination?.page ?? rawPagination?.currentPage ?? targetPage) || targetPage;
      const limit = Number(rawPagination?.limit ?? rawPagination?.pageSize ?? 10) || 10;
      const total =
        Number(
          rawPagination?.total ??
          rawPagination?.totalCount ??
          rawPagination?.totalOrders ??
          ordersList.length
        ) || 0;
      const totalPages = Math.max(
        1,
        Number(rawPagination?.totalPages ?? rawPagination?.pageCount) ||
        Math.ceil((total || ordersList.length || 1) / limit) ||
        1
      );

      const hasPrevPage =
        currentPage > 1 ||
        Boolean(rawPagination?.hasPrevPage) ||
        Boolean(rawPagination?.hasPreviousPage);

      const hasNextPage =
        currentPage < totalPages ||
        Boolean(rawPagination?.hasNextPage);

      const paginationMeta: PaginationMeta = {
        total,
        page: currentPage,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      };

      setOrders(ordersList);
      setPagination(paginationMeta);
      setTotalPending(
        response?.totalPendingPersonalizations ??
        (response as any)?.pendingPersonalizations ??
        0
      );
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#FFA136]">Store operations</p>
          <h1 className="mt-1 text-2xl font-bold text-[#333333]">Orders</h1>
          <p className="mt-1 text-sm text-[#666666]">
            Manage Shopify orders and personalization progress.
          </p>
        </div>
        <button
          onClick={() => fetchOrders(pagination.page)}
          disabled={isLoading}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="All orders"
          value={pagination.total.toString()}
          trend="Real-time"
          trendUp
          icon={Package}
          color="bg-[#F9EFE1] text-[#FFA136]"
        />
        <StatCard
          label="Pending personalizations"
          value={totalPending.toString()}
          trend="Active"
          icon={Clock3}
          color="bg-[#F2F2F2] text-[#666666]"
        />
        <StatCard
          label="Processed orders"
          value={Math.max(0, pagination.total - totalPending).toString()}
          trend="Completed"
          trendUp
          icon={Check}
          color="bg-[#F9EFE1] text-[#FFA136]"
        />
      </div>

      <OrdersTable
        orders={orders}
        onOpenOrder={onOpen}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={fetchOrders}
        title="All orders"
        subtitle="Full paginated list of Shopify orders"
      />
    </div>
  );
});

