export type TodoStatus = 'todo' | 'doing' | 'done'

export interface Todo {
  id: string
  title: string
  status: TodoStatus
  createdAt: number
}

export interface Project {
  id: string
  name: string
  todos: Todo[]
  createdAt: number
}
