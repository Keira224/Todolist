# Comprendre les fichiers et les composants du projet

Ce guide explique le rôle de chaque fichier et la manière dont les données circulent dans l'application.

## Vue générale

```text
index.html
    ↓
src/main.tsx
    ↓
src/App.tsx
    ├── ProjectSidebar
    ├── TodoForm
    └── KanbanBoard
            └── KanbanColumn
                    └── TodoCard
```

`App.tsx` possède les données principales. Les composants enfants reçoivent ces données et des fonctions grâce aux `props`.

## `src/types/todo.ts`

Ce fichier ne contient aucun composant visuel. Il définit la forme des données avec TypeScript.

### `TodoStatus`

```ts
export type TodoStatus = 'todo' | 'doing' | 'done'
```

Ce type indique qu'une tâche accepte seulement trois statuts :

- `todo` : la tâche est à faire ;
- `doing` : la tâche est en cours ;
- `done` : la tâche est terminée.

TypeScript refuse donc une valeur inconnue comme `finished`. Cela évite qu'une tâche disparaisse du tableau à cause d'un statut incorrect.

### `Todo`

```ts
export interface Todo {
  id: string
  title: string
  status: TodoStatus
  createdAt: number
}
```

L'interface `Todo` décrit une tâche :

- `id` est son identifiant unique ;
- `title` est le texte affiché sur la carte ;
- `status` détermine sa colonne ;
- `createdAt` est sa date de création sous forme de timestamp.

Exemple d'une tâche valide :

```ts
const todo: Todo = {
  id: '123',
  title: 'Apprendre React',
  status: 'todo',
  createdAt: Date.now(),
}
```

### `Project`

```ts
export interface Project {
  id: string
  name: string
  todos: Todo[]
  createdAt: number
}
```

L'interface `Project` décrit un espace de travail :

- `id` identifie le projet ;
- `name` contient son nom ;
- `todos` contient son tableau de tâches ;
- `createdAt` contient sa date de création.

`Todo[]` signifie « tableau composé uniquement d'objets `Todo` ».

Le mot `export` permet aux autres fichiers d'importer ces types. L'écriture `import type` indique que l'import sert seulement à la vérification TypeScript et n'ajoute aucun code JavaScript final.

## `src/utils/storage.ts`

Ce fichier regroupe la création et la sauvegarde des projets.

### `STORAGE_KEY`

```ts
const STORAGE_KEY = 'react-kanban-projects'
```

Cette constante est le nom utilisé pour ranger les données dans `localStorage`.

### `createProject`

Cette fonction reçoit un nom et retourne un objet conforme à l'interface `Project`. `crypto.randomUUID()` crée un identifiant unique, `todos: []` initialise une liste vide et `Date.now()` enregistre la date actuelle.

### `loadProjects`

Cette fonction est exécutée au premier chargement. Elle lit `localStorage`, puis utilise `JSON.parse` pour transformer le texte sauvegardé en tableau de projets. Si aucune donnée n'existe ou si elle est invalide, elle crée « Mon premier projet ».

### `saveProjects`

Cette fonction reçoit les projets, les transforme en texte avec `JSON.stringify`, puis les enregistre dans `localStorage`.

## `src/main.tsx`

Ce fichier démarre React :

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `document.getElementById('root')` récupère l'élément HTML principal ;
- `createRoot` crée la racine React ;
- `<App />` lance le composant principal ;
- `StrictMode` ajoute des vérifications pendant le développement ;
- `!` assure à TypeScript que l'élément `root` existe.

## `src/App.tsx`

`App` est le composant principal et le propriétaire de l'état global.

### États

```ts
const [projects, setProjects] = useState(loadProjects)
const [activeProjectId, setActiveProjectId] = useState(...)
```

- `projects` contient tous les projets et toutes les tâches ;
- `setProjects` remplace cette liste ;
- `activeProjectId` contient l'identifiant du projet sélectionné ;
- `setActiveProjectId` sélectionne un autre projet.

Passer directement `loadProjects` à `useState` permet de ne lire le stockage qu'au premier rendu.

### Projet actif

```ts
const activeProject =
  projects.find((project) => project.id === activeProjectId) ?? projects[0]
```

`find` cherche le projet sélectionné. `?? projects[0]` utilise le premier projet si l'identifiant n'est pas trouvé.

### Sauvegarde automatique

```ts
useEffect(() => {
  saveProjects(projects)
}, [projects])
```

Le tableau `[projects]` est la liste des dépendances. Chaque modification de `projects` déclenche la sauvegarde.

### Fonctions principales

- `addTodo` crée une tâche avec le statut `todo` et l'ajoute au projet actif ;
- `moveTodo` retrouve une tâche et remplace son statut ;
- `deleteTodo` retire une tâche avec `filter` ;
- `addProject` crée un projet, l'ajoute à la liste et le sélectionne.

Les appels à `setProjects` utilisent `map`, `filter` et le spread `...` afin de produire de nouveaux objets sans modifier directement l'ancien état.

### Affichage

`App` affiche trois composants :

- `ProjectSidebar` pour choisir un projet ;
- `TodoForm` pour créer une tâche ;
- `KanbanBoard` pour afficher les colonnes.

## `src/components/ProjectSidebar.tsx`

Ce composant affiche les projets et le formulaire de création d'un projet.

Ses props sont décrites par `ProjectSidebarProps` :

- `projects` contient les projets à afficher ;
- `activeProjectId` indique le bouton actif ;
- `onSelectProject` demande au parent de changer de projet ;
- `onAddProject` demande au parent de créer un projet.

`projectName` est un état local, car sa valeur ne concerne que le champ du formulaire. `projects.map(...)` transforme chaque projet en bouton. Le composant ne modifie jamais directement la liste des projets.

## `src/components/TodoForm.tsx`

Ce composant affiche le champ servant à créer une tâche.

```tsx
value={title}
onChange={(event) => setTitle(event.target.value)}
```

Le champ est contrôlé par l'état `title`. À chaque frappe, `onChange` met cet état à jour.

`handleSubmit` empêche le rechargement de la page, nettoie le texte avec `trim`, refuse une valeur vide, appelle `onAddTodo` et vide ensuite le champ.

## `src/components/KanbanBoard.tsx`

Ce composant construit le tableau Kanban.

La constante `COLUMNS` décrit les trois colonnes sans répéter trois fois le même JSX. Chaque objet contient un statut, un titre, une description, une couleur et une icône.

```tsx
todos={todos.filter((todo) => todo.status === column.status)}
```

Pour chaque colonne, `filter` conserve uniquement les tâches ayant le statut correspondant. Une tâche `doing` est donc envoyée à la colonne « En cours ».

## `src/components/KanbanColumn.tsx`

Ce composant affiche une colonne et les cartes qu'elle reçoit.

`todos.map(...)` transforme chaque tâche en composant `TodoCard`. Si le tableau est vide, un message « Aucune tâche » est affiché.

Pour le glisser-déposer :

- `handleDragOver` autorise le dépôt avec `preventDefault` ;
- `isDragOver` active le style visuel de survol ;
- `handleDrop` récupère l'identifiant de la tâche ;
- `onMove(todoId, status)` demande à `App` de changer son statut.

## `src/components/TodoCard.tsx`

Ce composant affiche le titre d'une tâche et ses actions.

L'attribut `draggable` autorise son déplacement. `handleDragStart` place son identifiant dans `dataTransfer`, afin que la colonne de destination puisse le récupérer.

Le bouton de suppression appelle `onDelete(todo.id)`. Le menu `select` appelle `onMove` avec le statut choisi. Ce menu rend aussi le déplacement possible sans souris.

## `src/index.css`

Ce fichier importe Tailwind CSS et définit les styles communs : police, couleurs générales, dimensions minimales et arrière-plan. Les styles spécifiques aux composants se trouvent dans leurs attributs `className`.

## Fichiers de configuration

### `index.html`

Il contient `<div id="root"></div>`, le point dans lequel React affiche l'application.

### `vite.config.ts`

Il active les plugins React et Tailwind utilisés par Vite.

### `package.json`

Il contient les dépendances et les commandes `npm run dev`, `npm run build` et `npm run preview`.

### Fichiers `tsconfig`

Ils configurent TypeScript. Le mode `strict` renforce notamment la vérification des types et `jsx: react-jsx` autorise le JSX dans les fichiers `.tsx`.

## Circulation complète d'une tâche

```text
L'utilisateur valide TodoForm
              ↓
TodoForm appelle onAddTodo
              ↓
App exécute addTodo et modifie projects
              ↓
KanbanBoard filtre les tâches par statut
              ↓
KanbanColumn crée les TodoCard
              ↓
useEffect sauvegarde projects dans localStorage
```

La règle importante est la suivante : les composants enfants affichent les données et signalent les actions, tandis que `App` conserve et modifie les données principales.
