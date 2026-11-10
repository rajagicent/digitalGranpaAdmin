"use client";

import { memo } from "react";
import { ChevronLeft, ChevronRight, Filter, Loader2, Package } from "lucide-react";
import { StatusBadge } from "../status-badge";
import type { Order, PaginationMeta } from "@/lib/api";

export interface OrdersTableProps {
  orders: Order[];
  onOpenOrder: (order: Order) => void;
  isLoading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const OrdersTable = memo(function OrdersTable({
  orders,
  onOpenOrder,
  isLoading = false,
  pagination,
  onPageChange,
  title = "Recent orders",
  subtitle = "Latest personalization activity across your store",
  showViewAll = false,
  onViewAll,
}: OrdersTableProps) {
  const getPersonalizationStatus = (order: Order) => {
    if (!order.personalizations || order.personalizations.length === 0) {
      return { label: "No personalization", tone: "neutral" };
    }
    const p = order.personalizations[0];
    if (p.status === "APPROVED" || p.personalizeStatus) {
      return { label: "Design Approved", tone: "green" };
    }
    if (p.status === "GENERATED") {
      return { label: "Generated", tone: "blue" };
    }
    return { label: "Pending Design", tone: "amber" };
  };

  const getPaymentBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return { label: "Paid", tone: "green" };
      case "PENDING":
        return { label: "Pending", tone: "amber" };
      case "REFUNDED":
        return { label: "Refunded", tone: "neutral" };
      case "FAILED":
        return { label: "Failed", tone: "red" };
      default:
        return { label: status || "Unknown", tone: "neutral" };
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#333333]">{title}</p>
          <p className="mt-0.5 text-xs text-[#666666]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {showViewAll && onViewAll && (
            <button
              onClick={onViewAll}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[#FFA136] px-3 text-xs font-semibold text-white hover:bg-[#ff941a]"
            >
              View all orders <ChevronRight size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fcfcfd] border-b border-slate-100 text-[#666666]">
            <tr>
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Items</th>
              <th className="px-5 py-3 font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Payment</th>
              <th className="px-5 py-3 font-semibold">Personalization</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[#333333]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#666666]">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin text-[#FFA136]" />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#666666]">
                  <Package size={32} className="mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold">No orders found</p>
                  <p className="text-[11px] text-slate-400">
                    Orders from your Shopify store will appear here.
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const pers = getPersonalizationStatus(order);
                const paym = getPaymentBadge(order.paymentStatus || order.financialStatus || "PAID");
                const dateStr = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <tr
                    key={order.order_id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-[#333333]">
                      #{order.orderNumber || order.order_id.slice(-6)}
                    </td>
                    <td className="px-5 py-3.5 text-[#666666]" suppressHydrationWarning>
                      {dateStr}
                    </td>
                    <td className="px-5 py-3.5 font-medium">
                      {order.email || order.contactEmail || "Customer"}
                    </td>
                    <td className="px-5 py-3.5 text-[#666666]">
                      {order.order_items?.length ?? 1} item
                      {(order.order_items?.length ?? 1) > 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3.5 font-semibold">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={paym.tone}>{paym.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={pers.tone}>{pers.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onOpenOrder(order)}
                        className="font-semibold text-[#FFA136] hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-[#666666]">
          <div>
            Showing page <span className="font-semibold">{pagination.page}</span> of{" "}
            <span className="font-semibold">{pagination.totalPages}</span> ({pagination.total} total)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Number(pagination.page) - 1)}
              disabled={Number(pagination.page) <= 1 || isLoading}
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 font-semibold text-[#333333] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              onClick={() => onPageChange(Number(pagination.page) + 1)}
              disabled={Number(pagination.page) >= Number(pagination.totalPages) || isLoading}
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 font-semibold text-[#333333] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

