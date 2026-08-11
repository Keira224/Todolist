import { useState, type FormEvent } from 'react'
import type { Project } from '../types/todo'

interface ProjectSidebarProps {
  projects: Project[]
  activeProjectId: string
  onSelectProject: (id: string) => void
  onAddProject: (name: string) => void
}

// Affiche les projets et le formulaire de création d'un espace.
export function ProjectSidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
}: ProjectSidebarProps) {
  const [projectName, setProjectName] = useState('')

  // Valide la saisie et transmet le nouveau projet au parent.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = projectName.trim()
    if (!cleanName) return

    onAddProject(cleanName)
    setProjectName('')
  }

  return (
    <aside className="rounded-[1.75rem] border border-white/80 bg-white/85 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 px-2 py-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
          <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="font-bold text-slate-900">Mes projets</p>
          <p className="text-xs text-slate-400">Espaces de travail</p>
        </div>
      </div>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible" aria-label="Projets">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId

          return (
            <button
              key={project.id}
              className={`flex min-w-44 items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full lg:min-w-0 ${
                isActive
                  ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              type="button"
              onClick={() => onSelectProject(project.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`size-2.5 shrink-0 rounded-full ${isActive ? 'bg-violet-500' : 'bg-slate-300'}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{project.name}</span>
              <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-xs text-slate-400">
                {project.todos.length}
              </span>
            </button>
          )
        })}
      </nav>

      <form className="mt-4 border-t border-slate-100 pt-4" onSubmit={handleSubmit}>
        <label className="mb-2 block px-1 text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="project-name">
          Nouvel espace
        </label>
        <div className="flex gap-2">
          <input
            id="project-name"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-3 focus:ring-violet-100"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Nom du projet"
            autoComplete="off"
          />
          <button
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-xl text-white transition hover:bg-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-200"
            type="submit"
            aria-label="Créer le projet"
            title="Créer le projet"
          >
            +
          </button>
        </div>
      </form>
    </aside>
  )
}
