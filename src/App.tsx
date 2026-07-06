import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
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
  { value: 'all', label: 'Todas' },
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
  const shouldReduceMotion = useReducedMotion()

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

  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#020b18' }}>

      {/* Dot grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(59,130,246,0.1) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 md:px-6 md:py-14">

        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#3b82f6' }}>
                Task Manager API
              </span>
              {isDemo && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-mono px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                  DEMO MODE
                </motion.span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Gestión de Tareas
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm"
            style={showForm
              ? { background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }
              : { background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', boxShadow: '0 0 24px rgba(59,130,246,0.35)', border: 'none' }
            }
          >
            <motion.span animate={{ rotate: showForm ? 45 : 0 }} transition={{ duration: 0.2 }}
              className="text-lg leading-none">+</motion.span>
            {showForm ? 'Cancelar' : 'Nueva tarea'}
          </motion.button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center justify-between"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
              {error}
              <button onClick={() => setError(null)} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New task form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl" style={{
                background: 'rgba(10,22,40,0.8)',
                border: '1px solid rgba(59,130,246,0.2)',
                boxShadow: '0 0 40px rgba(59,130,246,0.06)',
                backdropFilter: 'blur(16px)',
              }}>
                <TaskForm
                  onSubmit={(data) => { create(data); setShowForm(false) }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.1)', backdropFilter: 'blur(12px)' }}
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Total', value: stats.total, color: '#60a5fa' },
              { label: 'Pendientes', value: stats.pending, color: '#f59e0b' },
              { label: 'Completadas', value: stats.completed, color: '#10b981' },
            ].map(({ label, value, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.07 }} className="text-center">
                <motion.div
                  key={value}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-3xl font-bold tabular-nums" style={{ color }}>
                  {value}
                </motion.div>
                <div className="text-xs font-mono mt-0.5" style={{ color: '#334155' }}>{label}</div>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5" style={{ color: '#334155' }}>
                <span>Progreso</span>
                <span style={{ color: pct === 100 ? '#10b981' : '#475569' }}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.08)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: pct === 100 ? 'linear-gradient(90deg,#10b981,#06b6d4)' : 'linear-gradient(90deg,#3b82f6,#06b6d4)',
                    boxShadow: `0 0 8px ${pct === 100 ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.4)'}`,
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar tarea..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm rounded-xl pl-9 pr-4 py-2.5 font-mono"
              style={{ background: 'rgba(10,22,40,0.6)', border: '1px solid rgba(59,130,246,0.1)', color: '#e2e8f0', outline: 'none', backdropFilter: 'blur(8px)' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.06)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.1)'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(59,130,246,0.08)' }}>
            {FILTERS.map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className="relative px-3 py-1.5 text-xs font-mono rounded-lg transition-colors duration-200"
                style={{ color: filter === f.value ? '#60a5fa' : '#475569' }}>
                {filter === f.value && (
                  <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(59,130,246,0.12)' }} transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Priority filter */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2 mb-6 flex-wrap"
        >
          <span className="text-xs font-mono" style={{ color: '#1e293b' }}>Prioridad:</span>
          {PRIORITIES.map((p) => (
            <button key={p.value} onClick={() => setPriorityFilter(p.value)}
              className="text-xs font-mono px-3 py-1 rounded-lg transition-all duration-150"
              style={{
                background: priorityFilter === p.value ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: priorityFilter === p.value ? '#60a5fa' : '#334155',
                border: `1px solid ${priorityFilter === p.value ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.05)'}`,
              }}>
              {p.label}
            </button>
          ))}
        </motion.div>

        {/* Task list */}
        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                className="h-16 rounded-2xl" style={{ background: 'rgba(10,22,40,0.5)' }} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 flex flex-col items-center gap-3">
            <div className="text-4xl opacity-30">📋</div>
            <p className="text-sm font-mono" style={{ color: '#1e293b' }}>
              {tasks.length === 0 ? 'Sin tareas aún. ¡Crea la primera!' : 'No hay tareas con ese filtro'}
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visible.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i}
                  onToggle={toggle} onUpdate={update} onDelete={remove} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-10 text-center text-xs font-mono" style={{ color: '#0f172a' }}>
          {isDemo
            ? 'Modo demo · Ejecuta la API localmente para persistir datos'
            : 'Conectado · Task Manager API — FastAPI + PostgreSQL'
          }
        </motion.div>
      </div>
    </div>
  )
}
