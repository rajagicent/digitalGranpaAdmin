import { memo } from "react";
import { Check, FileImage, Package, Sparkles } from "lucide-react";

const WORKFLOW_STEPS = [
  ["Shopify order", Package],
  ["Personalization", Sparkles],
  ["Final design", FileImage],
] as const;

export interface WorkflowProps {
  active?: string;
  setActive?: (value: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (value: boolean) => void;
}

export const Workflow = memo(function Workflow(_props: WorkflowProps) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm font-bold text-[#333333]">
        Personalization pipeline
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {WORKFLOW_STEPS.map(([label, Icon]) => (
          <div key={label} className="rounded-lg bg-[#F2F2F2] p-3">
            <Icon size={16} className="text-[#FFA136]" />
            <p className="mt-3 text-xs font-semibold">{label}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600">
              <Check size={11} />
              Completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});
