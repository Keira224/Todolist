import { useEffect, useState } from 'react'
import { KanbanBoard } from './components/KanbanBoard'
import { ProjectSidebar } from './components/ProjectSidebar'
import { TodoForm } from './components/TodoForm'
import type { Todo, TodoStatus } from './types/todo'
import { createProject, loadProjects, saveProjects } from './utils/storage'

// Gère l'état global et affiche l'application.
function App() {
  const [projects, setProjects] = useState(loadProjects)
  const [activeProjectId, setActiveProjectId] = useState(() => projects[0]?.id ?? '')

  useEffect(() => {
    saveProjects(projects)
  }, [projects])

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0]

  // Ajoute une tâche au projet actif.
  function addTodo(title: string) {
    if (!activeProject) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      createdAt: Date.now(),
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? { ...project, todos: [newTodo, ...project.todos] }
          : project,
      ),
    )
  }

  // Déplace une tâche du projet actif vers un autre statut.
  function moveTodo(todoId: string, status: TodoStatus) {
    if (!activeProject) return

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              todos: project.todos.map((todo) =>
                todo.id === todoId ? { ...todo, status } : todo,
              ),
            }
          : project,
      ),
    )
  }

  // Supprime une tâche du projet actif.
  function deleteTodo(todoId: string) {
    if (!activeProject) return

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? { ...project, todos: project.todos.filter((todo) => todo.id !== todoId) }
          : project,
      ),
    )
  }

  // Crée et sélectionne un nouveau projet.
  function addProject(name: string) {
    const newProject = createProject(name)
    setProjects((currentProjects) => [...currentProjects, newProject])
    setActiveProjectId(newProject.id)
  }

  const completedCount =
    activeProject?.todos.filter((todo) => todo.status === 'done').length ?? 0
  const progress = activeProject?.todos.length
    ? Math.round((completedCount / activeProject.todos.length) * 100)
    : 0

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-[95rem] gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <ProjectSidebar
          projects={projects}
          activeProjectId={activeProject?.id ?? ''}
          onSelectProject={setActiveProjectId}
          onAddProject={addProject}
        />

        <section className="min-w-0">
          <header className="mb-6 rounded-[1.75rem] border border-white/80 bg-white/75 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
                  Espace de projet
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {activeProject?.name}
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{progress}% terminé</span>
                </div>
              </div>

              <div className="w-full xl:max-w-xl">
                <TodoForm onAddTodo={addTodo} />
              </div>
            </div>
          </header>

          {activeProject && (
            <KanbanBoard
              todos={activeProject.todos}
              onMove={moveTodo}
              onDelete={deleteTodo}
            />
          )}

          <footer className="mt-5 text-center text-xs text-slate-400">
            Glissez une carte entre les colonnes ou utilisez son menu « Déplacer vers ».
          </footer>
        </section>
      </div>
    </main>
  )
}

export default App
