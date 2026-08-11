# Ma Todo List

Une application Kanban front-end réalisée avec **React**, **TypeScript**, **Vite** et **Tailwind CSS**. Le code est volontairement simple et commenté afin de servir d'exemple pédagogique.

Une explication du code, fichier par fichier et composant par composant, est disponible dans [GUIDE_COMPOSANTS.md](./GUIDE_COMPOSANTS.md).

## Fonctionnalités

- créer plusieurs espaces de projet indépendants ;
- ajouter une tâche dans la colonne « À faire » ;
- déplacer une tâche entre « À faire », « En cours » et « Terminée » ;
- utiliser le glisser-déposer sur ordinateur ou le menu de déplacement sur mobile ;
- supprimer une tâche ;
- conserver automatiquement les données dans le `localStorage` du navigateur ;
- utiliser l'application sur mobile comme sur ordinateur.

## Installation et lancement

```bash
npm install
npm run dev
```

Vite affiche ensuite l'adresse locale à ouvrir dans le navigateur, généralement `http://localhost:5173`.

Pour vérifier et préparer une version de production :

```bash
npm run build
npm run preview
```

## Organisation du code

```text
src/
├── components/       # Petits composants visuels réutilisables
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── ProjectSidebar.tsx
│   ├── TodoCard.tsx
│   └── TodoForm.tsx
├── types/
│   └── todo.ts       # Types TypeScript de l'application
├── utils/
│   └── storage.ts    # Lecture et écriture dans localStorage
├── App.tsx           # État et logique principale
├── index.css         # Tailwind et styles globaux
└── main.tsx          # Point d'entrée React
```

## Notions React utilisées

- **Composants** : l'interface est divisée en petites parties faciles à comprendre.
- **Props** : le parent transmet des données et des fonctions aux enfants.
- **`useState`** : conserve les projets, le projet actif et les formulaires.
- **`useEffect`** : sauvegarde les projets après chaque changement.
- **Listes et clés** : `map` affiche un composant pour chaque tâche.
- **Événements** : les formulaires, menus et événements de glisser-déposer mettent à jour l'interface.

> Remarque : les fichiers JSON ne peuvent pas contenir de commentaires. Leur rôle est donc expliqué dans ce README, tandis que tous les fichiers de code compatibles comportent des commentaires directement dans leur contenu.
