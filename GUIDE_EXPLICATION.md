# Guide d'explication du projet Kanban

Ce document explique comment l'application a été construite, du démarrage du projet jusqu'à la sauvegarde des tâches. Il peut également servir de support pour présenter le code à l'oral.

## 1. Objectif de l'application

L'application est un gestionnaire de tâches organisé sous forme de tableau Kanban. L'utilisateur peut :

1. créer plusieurs projets ;
2. sélectionner un projet ;
3. ajouter une tâche ;
4. déplacer cette tâche entre « À faire », « En cours » et « Terminée » ;
5. supprimer une tâche ;
6. retrouver ses projets après avoir fermé ou actualisé la page.

L'application est uniquement front-end : elle ne possède ni serveur ni base de données. Les informations sont sauvegardées dans le navigateur avec `localStorage`.

## 2. Technologies utilisées

### Vite

Vite démarre le serveur de développement et prépare la version de production. Il est rapide et fournit la structure moderne du projet.

Commandes principales :

```bash
npm run dev      # démarre le projet en développement
npm run build    # vérifie TypeScript et produit le dossier dist
npm run preview  # affiche localement la version de production
```

### React

React construit l'interface à partir de composants. Lorsqu'un état change, React recalcule seulement les parties concernées de l'affichage.

### TypeScript

TypeScript ajoute des types au JavaScript. Il vérifie notamment qu'une tâche contient bien un identifiant, un titre, un statut et une date.

### Tailwind CSS

Tailwind permet de styliser les éléments avec des classes placées dans `className`, par exemple :

```tsx
<button className="rounded-xl bg-violet-600 px-4 py-2 text-white">
  Ajouter
</button>
```

## 3. Organisation générale

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

`App.tsx` est le composant parent. Il possède les données et les fonctions qui les modifient. Les autres composants reçoivent uniquement ce dont ils ont besoin grâce aux props.

## 4. Rôle de chaque fichier

### `package.json`

Ce fichier décrit le projet et ses dépendances :

- `react` et `react-dom` construisent l'interface ;
- `typescript` vérifie les types ;
- `vite` lance et compile le projet ;
- `tailwindcss` gère les styles ;
- `@vitejs/plugin-react` et `@tailwindcss/vite` relient React et Tailwind à Vite.

Le JSON n'accepte pas les commentaires, c'est pourquoi ce fichier est expliqué ici.

### `tsconfig.json`, `tsconfig.app.json` et `tsconfig.node.json`

Ces fichiers configurent TypeScript. Le mode `strict` active des vérifications plus sûres. `jsx: react-jsx` autorise la syntaxe JSX dans les fichiers `.tsx`. Ils ne contiennent pas de commentaires, car ils utilisent aussi le format JSON.

### `vite.config.ts`

Ce fichier active les plugins React et Tailwind dans Vite :

```ts
plugins: [react(), tailwindcss()]
```

### `index.html`

Il contient l'élément vide suivant :

```html
<div id="root"></div>
```

React utilise cet élément comme point d'ancrage pour afficher toute l'application.

### `src/main.tsx`

Ce fichier constitue le point d'entrée React. `createRoot` cherche `#root`, puis affiche le composant `App` à l'intérieur.

`StrictMode` ajoute des vérifications utiles pendant le développement. Il n'ajoute aucun élément visible.

### `src/types/todo.ts`

Le type suivant limite les statuts possibles :

```ts
type TodoStatus = 'todo' | 'doing' | 'done'
```

Une faute comme `'finished'` serait donc refusée par TypeScript.

L'interface `Todo` décrit une tâche :

- `id` : identifiant unique ;
- `title` : contenu de la tâche ;
- `status` : colonne actuelle ;
- `createdAt` : date de création.

L'interface `Project` décrit un espace :

- `id` : identifiant du projet ;
- `name` : nom affiché ;
- `todos` : tâches appartenant uniquement à ce projet ;
- `createdAt` : date de création.

### `src/utils/storage.ts`

Ce fichier isole tout ce qui concerne la sauvegarde.

`createProject` fabrique un objet projet. `crypto.randomUUID()` produit un identifiant unique et `Date.now()` enregistre la date actuelle.

`loadProjects` lit le texte stocké avec `localStorage.getItem`, puis `JSON.parse` reconstruit les tableaux et objets JavaScript.

`saveProjects` fait l'opération inverse : `JSON.stringify` transforme les données en texte avant `localStorage.setItem`.

Le bloc `try/catch` évite que l'application plante si les anciennes données sont incorrectes. Le fichier contient également une migration : les tâches créées avec la première version de l'application sont transférées dans « Mon premier projet ».

### `src/App.tsx`

Il s'agit du cerveau de l'application. Il conserve deux états :

```ts
const [projects, setProjects] = useState(loadProjects)
const [activeProjectId, setActiveProjectId] = useState(...)
```

- `projects` contient tous les projets et leurs tâches ;
- `activeProjectId` indique l'espace actuellement ouvert.

Le projet complet est retrouvé avec `find` :

```ts
const activeProject = projects.find(
  (project) => project.id === activeProjectId,
)
```

`useEffect` surveille le tableau `projects`. Dès qu'il change, les données sont sauvegardées :

```ts
useEffect(() => {
  saveProjects(projects)
}, [projects])
```

Les fonctions `addTodo`, `moveTodo`, `deleteTodo` et `addProject` se trouvent dans ce composant, car elles modifient l'état principal.

### `src/components/ProjectSidebar.tsx`

La barre latérale reçoit la liste des projets par props. `map` transforme chaque projet en bouton.

Lorsqu'un bouton est cliqué, `onSelectProject(project.id)` prévient `App`, qui remplace `activeProjectId`. L'interface affiche alors les tâches de ce projet.

Le champ « Nouvel espace » possède un petit état local `projectName`. À la validation, le composant appelle `onAddProject`, puis vide son champ.

### `src/components/TodoForm.tsx`

Le formulaire utilise un champ contrôlé :

```tsx
value={title}
onChange={(event) => setTitle(event.target.value)}
```

La valeur affichée vient de l'état `title`. Chaque frappe met cet état à jour.

À la validation :

1. `preventDefault` empêche le rechargement de la page ;
2. `trim` retire les espaces inutiles ;
3. une valeur vide est refusée ;
4. `onAddTodo` transmet le titre à `App` ;
5. `setTitle('')` vide le champ.

### `src/components/KanbanBoard.tsx`

Le tableau définit une configuration pour les trois colonnes. Chaque configuration contient un statut, un titre, une description, une couleur et une icône.

Le composant utilise `map` pour créer les trois colonnes. Pour chacune, `filter` conserve uniquement les tâches qui possèdent le statut correspondant :

```ts
todos.filter((todo) => todo.status === column.status)
```

Une tâche avec le statut `doing` apparaît donc automatiquement dans « En cours ».

### `src/components/KanbanColumn.tsx`

Chaque colonne reçoit déjà les tâches qu'elle doit afficher. Elle utilise `map` pour générer une `TodoCard` par tâche.

Elle constitue aussi la zone de dépôt du glisser-déposer :

- `onDragOver` autorise le dépôt avec `preventDefault` ;
- `isDragOver` change temporairement la couleur de la colonne ;
- `onDrop` récupère l'identifiant transporté par la carte ;
- `onMove(todoId, status)` demande à `App` de changer son statut.

### `src/components/TodoCard.tsx`

L'attribut `draggable` rend la carte déplaçable. Au début du déplacement, son identifiant est placé dans `dataTransfer` :

```ts
event.dataTransfer.setData('text/plain', todo.id)
```

Le menu `select` permet le même déplacement sur mobile ou au clavier. Son changement appelle directement `onMove`.

Le bouton corbeille appelle `onDelete(todo.id)`. La carte ne modifie jamais elle-même le tableau : elle transmet simplement une demande au parent.

### `src/index.css`

`@import "tailwindcss"` active Tailwind. Le reste du fichier définit la police, la couleur globale, la largeur minimale et les dégradés d'arrière-plan.

Les styles particuliers des composants restent dans leurs `className` Tailwind.

## 5. Implémentation de chaque fonctionnalité

### Création d'un projet

1. L'utilisateur écrit un nom dans `ProjectSidebar`.
2. Le formulaire appelle `onAddProject(name)`.
3. Cette prop correspond à la fonction `addProject` de `App`.
4. `createProject` produit un objet avec un nouvel identifiant.
5. Le projet est ajouté avec `[...currentProjects, newProject]`.
6. Son identifiant devient `activeProjectId`.
7. React effectue un nouveau rendu et affiche ce nouvel espace.
8. `useEffect` le sauvegarde dans `localStorage`.

### Ajout d'une tâche

1. `TodoForm` récupère et nettoie le texte.
2. Il appelle `addTodo` dans `App`.
3. `App` crée un objet `Todo` avec le statut initial `todo`.
4. `map` cherche uniquement le projet actif.
5. La tâche est ajoutée dans son tableau `todos`.
6. React recalcule `KanbanBoard`.
7. Le filtre de la colonne « À faire » trouve cette nouvelle tâche.
8. Une `TodoCard` apparaît.

### Déplacement par glisser-déposer

1. `TodoCard` place son `id` dans `dataTransfer`.
2. `KanbanColumn` autorise le dépôt.
3. Au dépôt, la colonne récupère cet `id`.
4. Elle appelle `moveTodo(id, nouveauStatus)` dans `App`.
5. `App` utilise deux `map` : un pour trouver le projet et un pour trouver la tâche.
6. Le spread `{ ...todo, status }` crée une copie avec le nouveau statut.
7. Au rendu suivant, le filtre retire la carte de l'ancienne colonne et l'ajoute dans la nouvelle.

### Déplacement avec le menu

Le `select` de `TodoCard` appelle la même fonction `moveTodo`. Il n'existe donc pas deux logiques différentes : le glisser-déposer et le menu changent tous deux le champ `status`.

### Suppression

1. La corbeille appelle `deleteTodo(id)`.
2. `App` cherche le projet actif.
3. `filter` conserve toutes les tâches dont l'identifiant est différent.
4. React actualise l'affichage et `useEffect` sauvegarde le résultat.

### Calcul de la progression

`filter` compte les tâches ayant le statut `done`. La formule suivante calcule un pourcentage :

```ts
Math.round((completedCount / activeProject.todos.length) * 100)
```

La largeur de la barre utilise ensuite ce résultat :

```tsx
style={{ width: `${progress}%` }}
```

### Sauvegarde automatique

Toutes les fonctionnalités remplacent le tableau `projects`. Ce changement déclenche le même `useEffect`, qui sauvegarde l'état complet. Il n'est donc pas nécessaire d'appeler manuellement `saveProjects` dans chaque fonction.

## 6. Pourquoi utiliser `map`, `filter` et le spread ?

React attend que l'état soit traité de manière immuable. Il faut éviter ceci :

```ts
projects[0].todos.push(newTodo)
```

Cette instruction modifie directement l'ancien tableau. À la place :

- `map` crée un nouveau tableau en remplaçant un élément ;
- `filter` crée un nouveau tableau en retirant un élément ;
- `{ ...objet }` crée une nouvelle copie d'un objet ;
- `[...tableau]` crée une nouvelle copie d'un tableau.

React détecte ainsi correctement le changement et met l'écran à jour.

## 7. Responsive et accessibilité

- Les préfixes Tailwind `sm:`, `md:`, `lg:` et `xl:` adaptent la mise en page à la largeur de l'écran.
- Les colonnes sont empilées sur petit écran et alignées à partir de la taille `md`.
- Le glisser-déposer étant difficile sur écran tactile, chaque carte possède aussi un `select`.
- Les `label`, `aria-label`, `aria-current` et `sr-only` aident les technologies d'assistance.
- Les styles `focus:ring-*` rendent la navigation au clavier visible.

## 8. Parcours complet des données

```text
Saisie utilisateur
      ↓
TodoForm appelle onAddTodo
      ↓
App modifie projects avec setProjects
      ↓
React effectue un nouveau rendu
      ↓
KanbanBoard filtre les tâches
      ↓
KanbanColumn crée les TodoCard
      ↓
useEffect sauvegarde projects dans localStorage
```

## 9. Trame courte pour une présentation orale

Vous pouvez présenter le projet ainsi :

> J'ai développé une application Kanban uniquement front-end avec React, TypeScript, Vite et Tailwind CSS. Le composant App centralise tous les projets et leurs tâches dans un état React. Chaque projet possède son propre tableau. Les composants enfants reçoivent les données et les actions avec des props. Une tâche possède un statut TypeScript limité à todo, doing ou done. Le tableau filtre les tâches selon ce statut pour construire les trois colonnes. Le déplacement change simplement le statut de la tâche, soit par glisser-déposer, soit avec un menu accessible sur mobile. Toutes les modifications sont immuables grâce à map, filter et au spread operator. Enfin, un useEffect sauvegarde automatiquement l'état dans le localStorage du navigateur.

## 10. Notions React démontrées

- composants fonctionnels ;
- JSX ;
- props ;
- événements ;
- formulaires contrôlés ;
- `useState` ;
- `useEffect` ;
- rendu conditionnel ;
- rendu de listes avec `map` et `key` ;
- remontée des actions d'un enfant vers son parent ;
- mise à jour immuable des tableaux et objets.
