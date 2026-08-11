import type { Project } from '../types/todo'

const STORAGE_KEY = 'react-kanban-projects'

// Crée un nouveau projet vide.
export function createProject(name: string): Project {
  return {
    id: crypto.randomUUID(),
    name,
    todos: [],
    createdAt: Date.now(),
  }
}

// Charge les projets sauvegardés ou crée le projet initial.
export function loadProjects(): Project[] {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY)
    if (savedProjects) return JSON.parse(savedProjects) as Project[]
    return [createProject('Mon premier projet')]
  } catch {
    return [createProject('Mon premier projet')]
  }
}

// Sauvegarde les projets dans le stockage du navigateur.
export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}
