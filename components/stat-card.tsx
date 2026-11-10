import { memo } from "react";
import type { ElementType } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  icon: ElementType;
  color: string;
}

export const StatCard = memo(function StatCard({
  label,
  value,
  trend,
  trendUp,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
        >
          <Icon size={17} />
        </div>
        <span
          className={`flex items-center gap-1 text-[11px] font-semibold ${trendUp ? "text-emerald-600" : "text-rose-600"}`}
        >
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {trend}
        </span>
      </div>
      <p className="mt-4 text-[12px] font-medium text-[#666666]">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-[#333333]">
        {value}
      </p>
    </div>
  );
});
