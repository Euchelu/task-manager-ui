import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Task, TaskUpdate } from '../types'
import { PriorityBadge } from './PriorityBadge'
import { TaskForm } from './TaskForm'

interface Props {
  task: Task
  index: number
  onToggle: (id: number) => void
  onUpdate: (id: number, data: TaskUpdate) => void
  onDelete: (id: number) => void
}

export function TaskCard({ task, index, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [hovered, setHovered] = useState(false)

  const date = new Date(task.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="rounded-2xl overflow-hidden"
      style={{
        background: task.completed ? 'rgba(5,15,31,0.4)' : 'rgba(10,22,40,0.7)',
        border: `1px solid ${hovered && !task.completed ? 'rgba(59,130,246,0.3)' : task.completed ? 'rgba(71,85,105,0.1)' : 'rgba(59,130,246,0.12)'}`,
        boxShadow: hovered && !task.completed ? '0 0 24px rgba(59,130,246,0.07)' : 'none',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="form" className="p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TaskForm
              initial={{ title: task.title, description: task.description ?? '', priority: task.priority }}
              submitLabel="Guardar cambios"
              onSubmit={(data) => { onUpdate(task.id, data); setEditing(false) }}
              onCancel={() => setEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div key="card" className="p-4 flex items-start gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Checkbox */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onToggle(task.id)}
              className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200"
              style={{
                background: task.completed ? 'linear-gradient(135deg,#10b981,#06b6d4)' : 'transparent',
                border: `2px solid ${task.completed ? '#10b981' : 'rgba(71,85,105,0.35)'}`,
                boxShadow: task.completed ? '0 0 10px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <motion.span
                  animate={{ opacity: task.completed ? 0.4 : 1 }}
                  className="font-medium text-sm leading-snug"
                  style={{
                    color: '#e2e8f0',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </motion.span>
                <PriorityBadge priority={task.priority} />
              </div>

              {task.description && (
                <p className="text-xs leading-relaxed mb-1.5 transition-opacity duration-200"
                  style={{ color: task.completed ? '#1e293b' : '#64748b' }}>
                  {task.description}
                </p>
              )}

              <span className="text-xs font-mono" style={{ color: '#1e293b' }}>
                #{task.id} · {date}
              </span>
            </div>

            {/* Actions */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1 flex-shrink-0"
            >
              {!confirmDelete ? (
                <>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg"
                    style={{ color: '#334155', background: 'rgba(59,130,246,0.0)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(59,130,246,0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = 'transparent' }}
                    title="Editar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmDelete(true)}
                    className="p-1.5 rounded-lg"
                    style={{ color: '#334155', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = 'transparent' }}
                    title="Eliminar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </motion.button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5">
                  <span className="text-xs font-mono" style={{ color: '#ef4444' }}>¿Eliminar?</span>
                  <button onClick={() => onDelete(task.id)}
                    className="text-xs font-mono px-2 py-0.5 rounded-md transition-colors duration-150"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                    Sí
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="text-xs font-mono px-2 py-0.5 rounded-md"
                    style={{ color: '#475569' }}>
                    No
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
