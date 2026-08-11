import { useState, type SubmitEvent } from 'react'

interface TodoFormProps {
  onAddTodo: (title: string) => void
}

// Affiche le formulaire de création d'une tâche.
export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('')

  // Valide la saisie et transmet la nouvelle tâche au parent.
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return

    onAddTodo(cleanTitle)
    setTitle('')
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">
        Nouvelle tâche
      </label>
      <input
        id="new-todo"
        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ajouter une tâche à faire..."
        autoComplete="off"
      />
      <button
        className="rounded-2xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 active:translate-y-0"
        type="submit"
      >
        Ajouter
      </button>
    </form>
  )
}
