import { memo } from "react";
import { Activity, Check } from "lucide-react";

const ACTIVITY_ITEMS = [
  "New Shopify order received",
  "Personalization submitted",
  "Design generated successfully",
];

export const ActivityPanel = memo(function ActivityPanel() {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#333333]">Activity feed</p>
          <p className="mt-1 text-xs text-[#666666]">
            What’s happening right now
          </p>
        </div>
        <Activity size={17} className="text-[#999999]" />
      </div>
      <div className="mt-5 space-y-4">
        {ACTIVITY_ITEMS.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 text-xs text-[#666666]"
          >
            <Check size={14} className="text-[#FFA136]" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
});
