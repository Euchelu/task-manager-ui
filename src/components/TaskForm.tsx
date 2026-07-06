import { useState } from 'react'
import type { Priority, TaskCreate } from '../types'

interface Props {
  onSubmit: (data: TaskCreate) => void
  onCancel: () => void
  initial?: Partial<TaskCreate> & { id?: number }
  submitLabel?: string
}

export function TaskForm({ onSubmit, onCancel, initial, submitLabel = 'Crear tarea' }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim() || undefined, priority })
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(10,22,40,0.8)',
    border: '1px solid rgba(59,130,246,0.15)',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: '0.6rem 0.875rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  }

  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'high',   label: 'Alta',  color: '#ef4444' },
    { value: 'medium', label: 'Media', color: '#f59e0b' },
    { value: 'low',    label: 'Baja',  color: '#10b981' },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        maxLength={200}
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.15)')}
        autoFocus
      />
      <textarea
        maxLength={1000}
        rows={2}
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...inputStyle, resize: 'vertical' }}
        onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.15)')}
      />
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: '#475569' }}>Prioridad:</span>
        {priorities.map((p) => (
          <button key={p.value} type="button" onClick={() => setPriority(p.value)}
            className="text-xs font-mono px-3 py-1 rounded transition-all duration-150"
            style={{
              background: priority === p.value ? `${p.color}18` : 'rgba(10,22,40,0.5)',
              color: priority === p.value ? p.color : '#475569',
              border: `1px solid ${priority === p.value ? p.color + '40' : 'rgba(71,85,105,0.2)'}`,
            }}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg transition-all duration-150"
          style={{ background: 'rgba(71,85,105,0.1)', color: '#64748b', border: '1px solid rgba(71,85,105,0.15)' }}>
          Cancelar
        </button>
        <button type="submit"
          className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', boxShadow: '0 0 16px rgba(59,130,246,0.2)' }}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
