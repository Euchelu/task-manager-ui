# Task Manager UI

Frontend React para la [Task Manager API](https://github.com/Euchelu/task-manager-api). Permite crear, editar, completar y eliminar tareas con filtros por estado y prioridad.

## Funcionalidades

- **CRUD completo** — crear, editar inline, marcar como completada, eliminar con confirmación
- **Filtros** — por estado (todas / pendientes / completadas) y prioridad (alta / media / baja)
- **Búsqueda** en tiempo real por título
- **Estadísticas** — contadores de total, pendientes y completadas
- **Demo mode** — datos de ejemplo cuando la API no está disponible (GitHub Pages)
- **Optimistic updates** — el toggle de completado es instantáneo, sin esperar a la API

## Stack

- React 19 + TypeScript
- Vite 8 + Tailwind CSS v4
- Sin librerías de UI externas

## Ejecutar en local

### Backend

```bash
cd ../task-manager-api
docker compose up -d        # PostgreSQL + API en localhost:8000
```

### Frontend

```bash
npm install
npm run dev                 # http://localhost:5173
```

El proxy de Vite redirige `/api/*` → `http://localhost:8000/*`.
