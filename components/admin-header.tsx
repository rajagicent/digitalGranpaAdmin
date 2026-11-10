"use client";

import { memo, useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

export interface HeaderProps {
  onMenu: () => void;
  collapsed?: boolean;
  onCollapse?: () => void;
  onLogout?: () => void;
}

export const Header = memo(function Header({
  onMenu,
  onLogout,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const adminEmail = adminUser?.email || "admin@example.com";
  const displayName = adminEmail.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-[#666666] hover:bg-[#F2F2F2] lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
            size={16}
          />
          <input
            placeholder="Search orders, customers..."
            className="h-9 w-64 rounded-lg border border-slate-200 bg-[#F2F2F2] pl-9 pr-3 text-xs outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-[#666666] hover:bg-[#F2F2F2]"
        >
          <Bell size={18} />
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[#F2F2F2]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800 capitalize">
                {displayName}
              </p>
              <p className="text-[10px] text-[#999999]">Administrator</p>
            </div>
            <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
            >
              <div className="px-3 py-1.5 text-[11px] text-slate-500 border-b border-slate-100 mb-1 truncate">
                {adminEmail}
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

