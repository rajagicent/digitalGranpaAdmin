"use client";

import { memo } from "react";
import {
  LayoutDashboard,
  Package,
  Shirt,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import logo from "@/public/logo.svg"
import Image from "next/image";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: Package },
  { label: "Products", icon: Shirt },
];

export interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (value: boolean) => void;
  active: string;
  setActive: (value: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (value: boolean) => void;
}

export const Sidebar = memo(function Sidebar({
  collapsed = false,
  setCollapsed = () => {},
  active,
  setActive,
}: SidebarProps) {
  return (
    <aside
      className={`${collapsed ? "w-19" : "w-62.5"} hidden shrink-0 border-r bg-white lg:flex lg:flex-col`}
    >
      <div className="flex h-18 items-center px-5">
        <span className="font-bold text-[#333333]">
          <Image src={logo} alt="Logo" width={collapsed ? 30 : 200} height={collapsed ? 30 : 40} />
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {SIDEBAR_ITEMS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active === label ? "bg-[#F9EFE1] text-[#333333]" : "text-[#666666]"}`}
          >
            <Icon size={17} />
            {!collapsed && label}
          </button>
        ))}
      </nav>
      <div className="border-t p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#666666]">
          <Settings size={17} />
          {!collapsed && "Settings"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#666666]"
        >
          {collapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
          {!collapsed && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
});
