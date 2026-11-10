'use client'

import { memo } from 'react'
import type { ReactNode } from 'react'

type StatusBadgeProps = { children: ReactNode; tone?: string }

const tones: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/15',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-600/10',
}

export const StatusBadge = memo(function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${tones[tone] || tones.neutral}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
})
