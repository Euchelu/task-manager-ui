import { useState } from 'react'
import type { Task, TaskUpdate } from '../types'
import { PriorityBadge } from './PriorityBadge'
import { TaskForm } from './TaskForm'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onUpdate: (id: number, data: TaskUpdate) => void
  onDelete: (id: number) => void
}

export function TaskCard({ task, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const date = new Date(task.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

  if (editing) {
    return (
      <div className="p-4 rounded-xl" style={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(59,130,246,0.3)' }}>
        <TaskForm
          initial={{ title: task.title, description: task.description ?? '', priority: task.priority }}
          submitLabel="Guardar cambios"
          onSubmit={(data) => { onUpdate(task.id, data); setEditing(false) }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div
      className="p-4 rounded-xl transition-all duration-200 group"
      style={{
        background: task.completed ? 'rgba(10,22,40,0.3)' : 'rgba(10,22,40,0.7)',
        border: `1px solid ${task.completed ? 'rgba(71,85,105,0.1)' : 'rgba(59,130,246,0.12)'}`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all duration-200"
          style={{
            background: task.completed ? '#10b981' : 'transparent',
            border: `2px solid ${task.completed ? '#10b981' : 'rgba(71,85,105,0.4)'}`,
          }}
        >
          {task.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="font-medium text-sm leading-snug"
              style={{
                color: task.completed ? '#475569' : '#e2e8f0',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="text-xs leading-relaxed mb-2" style={{ color: task.completed ? '#334155' : '#64748b' }}>
              {task.description}
            </p>
          )}

          <span className="text-xs font-mono" style={{ color: '#1e293b' }}>#{task.id} · {date}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: '#334155' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#60a5fa')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#334155')}
            title="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg transition-colors duration-150"
              style={{ color: '#334155' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#334155')}
              title="Eliminar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(task.id)}
                className="text-xs px-2 py-1 rounded font-mono transition-colors duration-150"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                Sí
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="text-xs px-2 py-1 rounded font-mono"
                style={{ color: '#475569' }}>
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
