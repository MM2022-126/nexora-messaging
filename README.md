# Messaging Web

A Vercel-ready messaging dashboard built with React, Vite, Tailwind CSS, and localStorage-backed demo auth. The app is a frontend + serverless API project intended to run entirely on one Vercel project without a database or external services.

## Overview

This project simulates a modern SaaS messaging experience with:

- local/demo authentication using browser storage
- user profiles and search
- one-to-one conversations
- messages with typing, editing, deletion, and replies
- unread counts and last-message previews
- light/dark theme support
- Vercel serverless health endpoint
- live tab synchronization via BroadcastChannel and storage events

## Important note

This app is intentionally designed as a client-side demo and is not secure production authentication. Because there is no server-side database, user credentials are hashed in-browser before being stored locally and should not be treated as secure identity data for production systems.

## Tech stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Lucide React
- Vercel Serverless Functions
- localStorage

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
├── vercel.json
└── README.md
```

## localStorage model

The application stores data in browser localStorage under keys such as:

- messaging_users
- messaging_current_user
- messaging_conversations
- messaging_messages
- messaging_theme
- messaging_drafts_<conversationId>

This keeps the app functional without a database while still persisting data across page refreshes.

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

## Vercel deployment

1. Push the project to a GitHub repository.
2. Import the repository in Vercel.
3. Use the project root as the Vercel app directory.
4. The root config includes the Vercel rewrite rules for SPA routing and `/api/*` handling.
5. Deploy with:

```bash
vercel
```

Or for production:

```bash
vercel --prod
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

Open the browser devtools and clear the localStorage keys for the app or run the following in the console:

```js
localStorage.clear();
```

This will reset the current demo data and log the user out.

## Production limitations

- This app does not provide secure authentication or persistent multi-user identity storage.
- It is built for demo and local-first use on Vercel only.
- Real-time messaging is simulated via browser events rather than a true production realtime backend.
