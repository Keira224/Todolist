import type { ReactNode } from 'react'
import type { Todo, TodoStatus } from '../types/todo'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  todos: Todo[]
  onMove: (id: string, status: TodoStatus) => void
  onDelete: (id: string) => void
}

const COLUMNS: Array<{
  status: TodoStatus
  title: string
  description: string
  accentClass: string
  icon: ReactNode
}> = [
  { status: 'todo', title: 'À faire', description: 'Tâches à commencer', accentClass: 'bg-sky-100 text-sky-600', icon: '○' },
  { status: 'doing', title: 'En cours', description: 'Travail en progression', accentClass: 'bg-amber-100 text-amber-600', icon: '◐' },
  { status: 'done', title: 'Terminée', description: 'Objectifs accomplis', accentClass: 'bg-emerald-100 text-emerald-600', icon: '✓' },
]

// Répartit les tâches dans les trois colonnes du Kanban.
export function KanbanBoard({ todos, onMove, onDelete }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.status}
          {...column}
          todos={todos.filter((todo) => todo.status === column.status)}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
