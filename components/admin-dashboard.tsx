"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./admin-header";
import { OrderDetail } from "./orders/order-detail";
import { OrdersTable } from "./orders/orders-table";
import { OrdersView } from "./orders/orders-view";
import { ProductDetail } from "./products/product-detail";
import { ProductsView } from "./products/products-view";
import { Sidebar } from "./sidebar";
import { StatCard } from "./stat-card";
import { Workflow } from "./workflow";
import { isAuthenticated, removeAuthToken } from "@/lib/auth";
import { dashboardApi, type DashboardData, type Order, type OrderItem } from "@/lib/api";
import {
  Clock3,
  Download,
  FileImage,
  LayoutDashboard,
  Loader2,
  Package,
  RefreshCw,
  Shirt,
  TrendingUp,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Orders", icon: Package },
      { label: "Products", icon: Shirt },
    ],
  },
] as const;

export const AdminDashboard = memo(function AdminDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("admin_user");
        if (stored) setAdminUser(JSON.parse(stored));
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated()) {
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.location.replace("/login?expired=1");
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      if (
        err?.status === 401 ||
        err?.message?.toLowerCase().includes("authorization token") ||
        err?.message?.toLowerCase().includes("authentication token") ||
        err?.message?.toLowerCase().includes("unauthorized") ||
        err?.message?.toLowerCase().includes("token")
      ) {
        removeAuthToken();
        if (typeof window !== "undefined") {
          window.location.replace("/login?expired=1");
        }
        return;
      }
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.location.replace("/login?expired=1");
      }
      return;
    }
    fetchDashboard();
  }, [fetchDashboard]);

  const handleSetActive = useCallback((tab: string) => {
    setActive(tab);
    setSelectedOrder(null);
    setSelectedProduct(null);
  }, []);

  const handleToggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleOpenOrderDetail = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleCloseOrderDetail = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const handleSelectProduct = useCallback((product: OrderItem) => {
    setSelectedProduct(product);
  }, []);

  const handleBackFromProduct = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleLogout = useCallback(() => {
    removeAuthToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_user");
      window.location.replace("/login?logout=1");
    }
  }, []);

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderContent = () => {
    if (selectedOrder) {
      return (
        <OrderDetail
          order={selectedOrder}
          onBack={handleCloseOrderDetail}
        />
      );
    }

    if (active === "Orders") {
      return <OrdersView onOpen={handleOpenOrderDetail} />;
    }

    if (active === "Products") {
      return selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onBack={handleBackFromProduct}
        />
      ) : (
        <ProductsView onOpen={handleSelectProduct} />
      );
    }

    // Dashboard View
    const totalOrders =
      dashboardData?.totalOrders ??
      (dashboardData as any)?.ordersCount ??
      (dashboardData?.orderDetails?.length ?? 0);
    const pendingPers =
      dashboardData?.totalPendingPersonalizations ??
      (dashboardData as any)?.pendingPersonalizations ??
      0;
    const totalPers =
      dashboardData?.totalPersonalizations ??
      (dashboardData as any)?.personalizationsCount ??
      0;
    const completedDesigns = Math.max(0, totalPers - pendingPers);
    const recentOrders: Order[] =
      dashboardData?.orderDetails ||
      (dashboardData as any)?.orders ||
      (dashboardData as any)?.recentOrders ||
      [];

    return (
      <>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p
              className="mb-1 text-xs font-semibold text-[#FFA136]"
              suppressHydrationWarning
            >
              {todayFormatted}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[#333333]">
              Welcome back{adminUser?.email ? `, ${adminUser.email.split("@")[0]}` : ""}
            </h1>
            <p className="mt-1 text-sm text-[#666666]">
              Here’s what’s happening with your personalized orders today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboard}
              disabled={isLoading}
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-[#F2F2F2] disabled:opacity-50"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => handleSetActive("Orders")}
              className="flex h-9 items-center gap-2 rounded-lg bg-[#FFA136] px-3 text-xs font-semibold text-white shadow-xs shadow-orange-200 hover:bg-[#ff941a]"
            >
              <Package size={14} /> View orders
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total orders"
            value={isLoading ? "..." : totalOrders.toLocaleString()}
            trend="All time"
            trendUp
            icon={Package}
            color="bg-orange-100 text-[#FFA136]"
          />
          <StatCard
            label="Pending personalizations"
            value={isLoading ? "..." : pendingPers.toLocaleString()}
            trend="Needs attention"
            icon={Clock3}
            color="bg-violet-100 text-violet-600"
          />
          <StatCard
            label="Completed designs"
            value={isLoading ? "..." : completedDesigns.toLocaleString()}
            trend="Ready"
            trendUp
            icon={FileImage}
            color="bg-emerald-100 text-emerald-600"
          />
        </div>

        <div className="mt-6">
          <Workflow
            active={active}
            setActive={handleSetActive}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </div>

        <div className="mt-6">
          <OrdersTable
            orders={recentOrders}
            onOpenOrder={handleOpenOrderDetail}
            isLoading={isLoading}
            title="Recent orders"
            subtitle="Latest orders from your Shopify store"
            showViewAll
            onViewAll={() => handleSetActive("Orders")}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#666666]">
              <TrendingUp size={15} className="text-emerald-500" /> Total Active Orders
            </div>
            <p className="mt-3 text-xl font-bold text-[#333333]">
              {isLoading ? "..." : totalOrders}
            </p>
            <p className="mt-1 text-[10px] text-emerald-600">
              Synced from Shopify
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#666666]">
              <Shirt size={15} className="text-sky-500" /> Pending Customizations
            </div>
            <p className="mt-3 text-xl font-bold text-[#333333]">
              {isLoading ? "..." : pendingPers}
            </p>
            <p className="mt-1 text-[10px] text-[#999999]">Awaiting generation</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#333333]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        active={active}
        setActive={handleSetActive}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={handleToggleMobile} onLogout={handleLogout} />
        {mobileOpen && (
          <div className="absolute inset-x-0 top-18 z-30 border-b border-slate-200 bg-white p-3 shadow-lg lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleSetActive(item.label);
                      handleCloseMobile();
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium ${
                      active === item.label
                        ? "bg-[#F9EFE1] text-[#FFA136]"
                        : "text-slate-600"
                    }`}
                  >
                    <Icon size={15} /> {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
});

export default AdminDashboard;

