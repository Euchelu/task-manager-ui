import { useState } from 'react'
import { useTasks } from './useTasks'
import { TaskCard } from './components/TaskCard'
import { TaskForm } from './components/TaskForm'
import type { Filter, Priority } from './types'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

const PRIORITIES: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'Cualquier prioridad' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
]

export default function App() {
  const { tasks, loading, isDemo, error, setError, create, toggle, update, remove } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [search, setSearch] = useState('')

  const visible = tasks.filter((t) => {
    if (filter === 'pending' && t.completed) return false
    if (filter === 'completed' && !t.completed) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.375rem 0.875rem',
    borderRadius: 8,
    fontSize: '0.8125rem',
    fontFamily: 'monospace',
    cursor: 'pointer',
    border: 'none',
    background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
    color: active ? '#60a5fa' : '#475569',
    transition: 'all 0.15s',
  })

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: '#020b18' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#3b82f6' }}>
                Task Manager API
              </span>
              {isDemo && (
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                  DEMO MODE
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#e2e8f0' }}>Gestión de Tareas</h1>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
            style={{ background: showForm ? 'rgba(59,130,246,0.08)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', boxShadow: showForm ? 'none' : '0 0 20px rgba(59,130,246,0.25)', border: showForm ? '1px solid rgba(59,130,246,0.25)' : 'none' }}>
            {showForm ? '✕ Cancelar' : '+ Nueva tarea'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center justify-between"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            {error}
            <button onClick={() => setError(null)} style={{ color: '#ef4444', opacity: 0.6 }}>✕</button>
          </div>
        )}

        {/* New task form */}
        {showForm && (
          <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <TaskForm
              onSubmit={(data) => { create(data); setShowForm(false) }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: '#60a5fa' },
            { label: 'Pendientes', value: stats.pending, color: '#f59e0b' },
            { label: 'Completadas', value: stats.completed, color: '#10b981' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.08)' }}>
              <div className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
              <div className="text-xs font-mono mt-0.5" style={{ color: '#475569' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm rounded-lg px-3 py-2 font-mono"
            style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.1)', color: '#e2e8f0', outline: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.35)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.1)')}
          />

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(59,130,246,0.08)' }}>
            {FILTERS.map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)} style={tabStyle(filter === f.value)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {PRIORITIES.map((p) => (
            <button key={p.value} onClick={() => setPriorityFilter(p.value)}
              className="text-xs font-mono px-3 py-1 rounded-lg transition-all duration-150"
              style={{
                background: priorityFilter === p.value ? 'rgba(59,130,246,0.12)' : 'transparent',
                color: priorityFilter === p.value ? '#60a5fa' : '#334155',
                border: `1px solid ${priorityFilter === p.value ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.06)'}`,
              }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-16 text-sm font-mono" style={{ color: '#334155' }}>Cargando tareas...</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#1e293b' }}>
            <div className="text-3xl mb-3">📋</div>
            <div className="text-sm font-mono">{tasks.length === 0 ? 'Sin tareas. ¡Crea la primera!' : 'No hay tareas con ese filtro'}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {visible.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={toggle} onUpdate={update} onDelete={remove} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs font-mono" style={{ color: '#1e293b' }}>
          {isDemo ? 'Modo demo — ejecuta la API localmente para persistir datos' : 'Conectado a Task Manager API · FastAPI + PostgreSQL'}
        </div>
      </div>
    </div>
  )
}
