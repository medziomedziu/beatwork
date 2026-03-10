# Beatflow — Ableton Live Course Platform

A warm, minimal learning platform for teaching music production with Ableton Live.

## Setup

```bash
cd beatflow
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Routes

| Route | Description |
|---|---|
| `/` | Student dashboard — course overview and progress |
| `/module/:id` | Module detail — lessons, notes, Q&A |
| `/teacher` | Teacher Q&A inbox — answer questions |

## Switching Roles

Use the **Student / Teacher** toggle at the bottom of the sidebar to switch between views.

## Tech Stack

- React 18 + Vite
- React Router v6
- Framer Motion (animations)
- Lucide React (icons)
- Custom CSS (no UI library)
- localStorage for state persistence
