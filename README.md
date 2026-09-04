# TaskFlow

TaskFlow is a React frontend for organizing projects and their tasks. It
connects to a REST API, stores the authenticated session in the browser, and
provides project and task management from a responsive Material UI interface.

## Features

- Token-based login and protected routes
- Project creation, listing, editing, and deletion
- Task creation, listing, editing, status changes, and deletion
- Task priorities, due dates, and project-scoped navigation
- Loading and API error states

## Requirements

- Node.js 20 or newer
- npm
- A compatible TaskFlow API

## Local setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` for local configuration:

```bash
cp .env.example .env
```

Set the API URL when it is not served from `/api`:

```env
VITE_API_URL=https://your-api.example.com
```

The `.env` file is intentionally ignored and must never be committed.

Start the development server:

```bash
npm run dev
```

## Validation

Run the static checks and production build before submitting changes:

```bash
npm run lint
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

## Technology

- React 19 and TypeScript
- Vite
- Material UI
- React Router
- Axios
