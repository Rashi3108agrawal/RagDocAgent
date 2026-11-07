# RagDocAgent frontend

The frontend is a React and TypeScript client built with Vite. It provides the
document workspace, conversation history, retrieval controls, document
previews, and citation navigation. Requests use the existing backend `/api`
routes.

## Development

From this directory, install dependencies and start Vite:

```powershell
npm ci
npm run dev
```

The development server expects the API at `http://localhost:8000`. Configure
optional client-side analytics with `VITE_YANDEX_METRIKA_ID` or
`VITE_GA4_MEASUREMENT_ID` in a local `.env` file.

## Checks

```powershell
npm run lint
npm run build
```

The production build is written to `dist/` and is served either by the
frontend's nginx container or the combined application image.
