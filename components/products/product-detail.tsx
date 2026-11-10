"use client";

import { memo } from "react";
import { ChevronRight, Package, Shirt, Tag } from "lucide-react";
import { StatusBadge } from "../status-badge";
import type { OrderItem } from "@/lib/api";

export interface ProductDetailProps {
  product: OrderItem;
  onBack: () => void;
}

export const ProductDetail = memo(function ProductDetail({
  product,
  onBack,
}: ProductDetailProps) {
  const isAvailable = product.productExists !== false;

  const details = [
    ["Price", `$${Number(product.price || 0).toFixed(2)}`],
    ["Quantity Ordered", product.quantity?.toString() || "1"],
    ["SKU", product.sku || "N/A"],
    ["Fulfillment Status", product.fulfillmentStatus || "Unfulfilled"],
    ["Vendor", product.vendor || "Digital Grandpa"],
    ["Fulfillment Service", product.fulfillmentService || "Manual"],
  ] as const;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to products"
        className="flex items-center gap-2 text-xs font-semibold text-[#666666] hover:text-[#333333]"
      >
        <ChevronRight size={15} className="rotate-180" />
        Back to products
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#333333]">{product.title}</h1>
        <StatusBadge tone={isAvailable ? "green" : "neutral"}>
          {isAvailable ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 md:row-span-2 shadow-xs">
          <div className="flex h-56 items-center justify-center rounded-lg bg-[#F2F2F2] overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <Shirt size={80} className="text-[#FFA136]" />
            )}
          </div>
          <p className="mt-4 text-sm font-semibold text-[#333333]">
            {product.variantTitle || "Default Variant"}
          </p>
          <p className="mt-1 text-xs text-[#666666]">
            Item ID: {product.item_id}
          </p>
        </div>

        {details.map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-white p-5 shadow-xs">
            <p className="text-xs text-[#999999]">{label}</p>
            <p className="mt-2 text-base font-bold text-[#333333]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

