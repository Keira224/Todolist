import { useState, type DragEvent, type ReactNode } from 'react'
import type { Todo, TodoStatus } from '../types/todo'
import { TodoCard } from './TodoCard'

interface KanbanColumnProps {
  title: string
  description: string
  status: TodoStatus
  todos: Todo[]
  icon: ReactNode
  accentClass: string
  onMove: (id: string, status: TodoStatus) => void
  onDelete: (id: string) => void
}

// Affiche une colonne et accepte les tâches déposées dans son statut.
export function KanbanColumn({
  title,
  description,
  status,
  todos,
  icon,
  accentClass,
  onMove,
  onDelete,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  // Autorise le dépôt et indique visuellement la colonne survolée.
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  // Récupère la tâche déposée et lui attribue le statut de la colonne.
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const todoId = event.dataTransfer.getData('text/plain')
    if (todoId) onMove(todoId, status)
    setIsDragOver(false)
  }

  return (
    <section
      className={`flex min-h-[28rem] min-w-0 flex-col rounded-[1.5rem] border bg-slate-50/80 p-3.5 transition ${
        isDragOver ? 'border-violet-400 bg-violet-50 ring-4 ring-violet-100' : 'border-slate-200/70'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <header className="mb-4 flex items-center gap-3 px-1 py-1">
        <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${accentClass}`} aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800">{title}</h2>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-400 shadow-sm">
              {todos.length}
            </span>
          </div>
          <p className="truncate text-xs text-slate-400">{description}</p>
        </div>
      </header>

      <div className="flex-1 space-y-3">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onMove={onMove} onDelete={onDelete} />
        ))}

        {todos.length === 0 && (
          <div className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/50 px-4 text-center">
            <div>
              <p className="text-sm font-medium text-slate-400">Aucune tâche</p>
              <p className="mt-1 text-xs text-slate-300">Déposez une carte ici</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
