# Order System Frontend

Frontend for the Food Order System built with React, Vite, TypeScript, and SCSS.

## Prerequisites

- Node.js (v18+)
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Running the app

```bash
# development server (default port 5173)
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Configuration

API endpoint is proxied in `vite.config.ts`. Default target is `http://localhost:3000/api`.

## Project Structure

- `src/components/`: Reusable UI components (Layout, Common).
- `src/pages/`: Page components corresponding to routes.
- `src/services/`: Axios API integration layers.
- `src/stores/`: Zustand global state management.
- `src/styles/`: Global SCSS design system and variables.
- `src/types/`: TypeScript interfaces and types.
