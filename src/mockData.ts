import type { Task } from './types'

export const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Configurar entorno Docker', description: 'Dockerizar la API con PostgreSQL y volumen persistente', completed: true, priority: 'high', created_at: '2025-01-10T09:00:00Z', updated_at: '2025-01-11T14:30:00Z' },
  { id: 2, title: 'Escribir tests de integración', description: 'Cubrir todos los endpoints con pytest y httpx', completed: true, priority: 'high', created_at: '2025-01-12T10:00:00Z', updated_at: '2025-01-13T16:00:00Z' },
  { id: 3, title: 'Implementar paginación', description: 'Añadir skip/limit a GET /tasks', completed: false, priority: 'medium', created_at: '2025-01-14T08:00:00Z', updated_at: null },
  { id: 4, title: 'Documentar la API', description: null, completed: false, priority: 'low', created_at: '2025-01-15T11:00:00Z', updated_at: null },
  { id: 5, title: 'Añadir autenticación JWT', description: 'Proteger endpoints con Bearer token', completed: false, priority: 'high', created_at: '2025-01-16T09:30:00Z', updated_at: null },
]
