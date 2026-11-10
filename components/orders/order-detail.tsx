"use client";

import { memo } from "react";
import { ChevronRight, Package, Shirt, Sparkles, User } from "lucide-react";
import { StatusBadge } from "../status-badge";
import type { Order } from "@/lib/api";

export interface OrderDetailProps {
  order: Order | null;
  onBack: () => void;
}

export const OrderDetail = memo(function OrderDetail({
  order,
  onBack,
}: OrderDetailProps) {
  if (!order) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#666666] hover:text-[#333333]"
        >
          <ChevronRight size={15} className="rotate-180" />
          Back to orders
        </button>
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-[#666666]">
          No order selected.
        </div>
      </div>
    );
  }

  const items = order.order_items || [];
  const personalizations = order.personalizations || [];
  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#666666] hover:text-[#333333]"
        >
          <ChevronRight size={15} className="rotate-180" />
          Back to orders
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#333333]">
            Order #{order.orderNumber || order.order_id.slice(-6)}
          </h1>
          <StatusBadge tone={order.status === "COMPLETED" ? "green" : "amber"}>
            {order.status || "PENDING"}
          </StatusBadge>
          <StatusBadge tone={order.paymentStatus === "PAID" ? "green" : "neutral"}>
            {order.paymentStatus || "PAID"}
          </StatusBadge>
        </div>
        <p className="text-xs text-[#666666]" suppressHydrationWarning>
          Placed on {dateFormatted}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#666666]">
            <User size={14} className="text-[#FFA136]" /> Customer Details
          </div>
          <p className="mt-2 text-sm font-bold text-[#333333]">
            {order.email || order.contactEmail || "No email"}
          </p>
          {order.shopifyCustomerId && (
            <p className="mt-0.5 text-[11px] text-[#999999]">
              Customer ID: {order.shopifyCustomerId}
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#666666]">
            <Package size={14} className="text-[#FFA136]" /> Financial Summary
          </div>
          <p className="mt-2 text-sm font-bold text-[#333333]">
            Total: ${Number(order.totalAmount || 0).toFixed(2)} {order.currency || "USD"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#999999]">
            Subtotal: ${Number(order.subtotal || 0).toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#666666]">
            <Sparkles size={14} className="text-[#FFA136]" /> Personalization
          </div>
          <p className="mt-2 text-sm font-bold text-[#333333]">
            {personalizations.length > 0
              ? `${personalizations.length} Customization(s)`
              : "Standard Order"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#999999]">
            {personalizations[0]?.status || "No personalization required"}
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-xl border bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-[#333333]">Order Items</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {items.length === 0 ? (
            <p className="py-4 text-xs text-[#666666]">No line items recorded.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.item_id}
                className="flex items-center justify-between py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F2F2F2]">
                    <Shirt size={22} className="text-[#FFA136]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#333333]">{item.title}</p>
                    <p className="text-[11px] text-[#666666]">
                      {item.variantTitle || "Default Variant"} · Qty: {item.quantity}
                    </p>
                    {item.sku && (
                      <p className="text-[10px] text-[#999999]">SKU: {item.sku}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#333333]">
                    ${Number(item.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Personalizations Section */}
      {personalizations.length > 0 && (
        <div className="rounded-xl border bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-[#333333]">
            Personalization Information
          </h2>
          <div className="mt-4 space-y-4">
            {personalizations.map((p) => (
              <div
                key={p.personalization_id}
                className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#333333]">
                    For: {p.forWhom || "Grandpa"}
                  </span>
                  <StatusBadge
                    tone={
                      p.status === "APPROVED" || p.personalizeStatus
                        ? "green"
                        : "amber"
                    }
                  >
                    {p.status}
                  </StatusBadge>
                </div>
                {p.uploadedImage && (
                  <p className="mt-2 text-[11px] text-[#666666]">
                    Photo attached:{" "}
                    <a
                      href={p.uploadedImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFA136] underline"
                    >
                      View uploaded image
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

