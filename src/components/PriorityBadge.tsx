import type { Priority } from '../types'

const config = {
  high:   { label: 'Alta',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)'  },
  medium: { label: 'Media', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  low:    { label: 'Baja',  color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = config[priority]
  return (
    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      <span className="w-1 h-1 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  )
}
