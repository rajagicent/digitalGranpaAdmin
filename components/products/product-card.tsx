"use client";

import { memo } from "react";
import { Shirt } from "lucide-react";
import { StatusBadge } from "../status-badge";
import type { OrderItem } from "@/lib/api";

export interface ProductCardProps {
  product: OrderItem;
  onOpen: (product: OrderItem) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  onOpen,
}: ProductCardProps) {
  const isAvailable = product.productExists !== false;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex h-36 items-center justify-center rounded-lg bg-[#F2F2F2] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <Shirt size={48} className="text-[#FFA136]" />
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#333333] line-clamp-1">
            {product.title}
          </h2>
          <p className="mt-1 text-xs text-[#666666]">
            {product.variantTitle || "Standard"}
          </p>
        </div>
        <StatusBadge tone={isAvailable ? "green" : "neutral"}>
          {isAvailable ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <span className="font-semibold text-[#333333]">
          ${Number(product.price || 0).toFixed(2)}
        </span>
        <button
          onClick={() => onOpen(product)}
          className="font-semibold text-[#FFA136] hover:underline"
        >
          View details
        </button>
      </div>
    </article>
  );
});

