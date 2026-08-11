import type { DragEvent } from 'react'
import type { Todo, TodoStatus } from '../types/todo'

interface TodoCardProps {
  todo: Todo
  onMove: (id: string, status: TodoStatus) => void
  onDelete: (id: string) => void
}

// Affiche une tâche et ses actions de déplacement et de suppression.
export function TodoCard({ todo, onMove, onDelete }: TodoCardProps) {
  // Prépare l'identifiant de la tâche pour le glisser-déposer.
  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.setData('text/plain', todo.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <article
      className="group cursor-grab rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-violet-400" />
        <p className="min-w-0 flex-1 break-words text-sm font-semibold leading-6 text-slate-700">
          {todo.title}
        </p>
        <button
          className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-3 focus:ring-red-100"
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Supprimer la tâche : ${todo.title}`}
          title="Supprimer"
        >
          <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[0.68rem] font-medium uppercase tracking-wider text-slate-300">Déplacer vers</span>
        <label className="sr-only" htmlFor={`move-${todo.id}`}>Déplacer la tâche</label>
        <select
          id={`move-${todo.id}`}
          className="rounded-lg border-0 bg-slate-100 px-2 py-1.5 text-xs font-semibold text-slate-500 outline-none transition hover:bg-slate-200 focus:ring-3 focus:ring-violet-100"
          value={todo.status}
          onChange={(event) => onMove(todo.id, event.target.value as TodoStatus)}
        >
          <option value="todo">À faire</option>
          <option value="doing">En cours</option>
          <option value="done">Terminée</option>
        </select>
      </div>
    </article>
  )
}
