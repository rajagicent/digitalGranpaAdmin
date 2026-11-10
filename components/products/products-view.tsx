"use client";

import { memo, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2, Package, RefreshCw } from "lucide-react";
import { ProductCard } from "./product-card";
import { productsApi, type OrderItem, type PaginationMeta } from "@/lib/api";

export interface ProductsViewProps {
  onOpen: (product: OrderItem) => void;
}

export const ProductsView = memo(function ProductsView({
  onOpen,
}: ProductsViewProps) {
  const [products, setProducts] = useState<OrderItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    const targetPage = Math.max(1, Number(page) || 1);
    try {
      const response = await productsApi.getProducts({ page: targetPage, limit: 12 });
      const productsList: OrderItem[] =
        response?.productPaginatedResult?.data ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray((response as any)?.products) ? (response as any).products : null) ||
        (Array.isArray(response) ? (response as unknown as OrderItem[]) : []) ||
        [];

      const rawPagination: any =
        response?.productPaginatedResult?.pagination ||
        response?.pagination ||
        (response as any)?.meta ||
        (response as any)?.productPaginatedResult;

      const currentPage =
        Number(rawPagination?.page ?? rawPagination?.currentPage ?? targetPage) || targetPage;
      const limit = Number(rawPagination?.limit ?? rawPagination?.pageSize ?? 12) || 12;
      const total =
        Number(
          rawPagination?.total ??
          rawPagination?.totalCount ??
          rawPagination?.totalProducts ??
          productsList.length
        ) || 0;
      const totalPages = Math.max(
        1,
        Number(rawPagination?.totalPages ?? rawPagination?.pageCount) ||
        Math.ceil((total || productsList.length || 1) / limit) ||
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

      setProducts(productsList);
      setPagination(paginationMeta);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    const currentPage = Number(pagination.page) || 1;
    if (isLoading || currentPage <= 1) return;
    fetchProducts(currentPage - 1);
  }, [fetchProducts, isLoading, pagination.page]);

  const handleNextPage = useCallback(() => {
    const currentPage = Number(pagination.page) || 1;
    const totalPages = Number(pagination.totalPages) || 1;
    if (isLoading || currentPage >= totalPages) return;
    fetchProducts(currentPage + 1);
  }, [fetchProducts, isLoading, pagination.page, pagination.totalPages]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#FFA136]">Catalog</p>
          <h1 className="mt-1 text-2xl font-bold text-[#333333]">Products</h1>
          <p className="mt-1 text-sm text-[#666666]">
            View products connected from your Shopify store.
          </p>
        </div>
        <button
          onClick={() => fetchProducts(pagination.page)}
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

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <Loader2 size={20} className="animate-spin text-[#FFA136]" />
            Loading catalog...
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-100 bg-white p-8 text-center text-[#666666]">
          <Package size={36} className="mb-2 text-slate-300" />
          <p className="font-semibold">No products found</p>
          <p className="text-xs text-slate-400">
            Products synced from Shopify will appear in this catalog.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.item_id}
              product={product}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-[#666666]">
          <div>
            Showing page <span className="font-semibold">{pagination.page}</span> of{" "}
            <span className="font-semibold">{pagination.totalPages}</span> ({pagination.total} items)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={Number(pagination.page) <= 1 || isLoading}
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-semibold text-[#333333] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={Number(pagination.page) >= Number(pagination.totalPages) || isLoading}
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-semibold text-[#333333] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

