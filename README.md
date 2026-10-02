# Messaging Web

A messaging dashboard built with React, Vite, and Tailwind CSS for a modern chat demo experience.

## Overview

This project simulates a modern SaaS messaging experience with:

- demo authentication
- user profiles and search
- one-to-one conversations
- messages with typing, editing, deletion, and replies
- unread counts and last-message previews
- light/dark theme support
- live tab synchronization via BroadcastChannel and storage events

## Important note

This app is intentionally designed as a demo experience and is not a secure production authentication system.

## Tech stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide React

## Folder structure

```text
messaging-app/
├── api/
│   └── health.js
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Data persistence

The application keeps demo data in the browser so it persists across refreshes while staying easy to run locally.

## Local development

```bash
npm install
npm run dev
```

Then open the dev server URL, usually:

```text
http://localhost:5173
```

## Production build

```bash
npm run build
npm run preview
```

## API endpoints

- GET /api/health

Returns:

```json
{
  "success": true,
  "message": "API is running"
}
```

## Resetting application data

Open the browser devtools and clear the app data for this site to reset the current demo state and log the user out.

## Production limitations

- This app is intended for demo use and does not provide secure production authentication.
- Real-time messaging is simulated via browser events rather than a true production realtime backend.
