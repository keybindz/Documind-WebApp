# DocuMind frontend

React + TypeScript + Vite frontend for the DocuMind FastAPI backend.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- DocuMind API running locally (default `http://localhost:8000`)

## Getting started

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173. Configure `VITE_API_URL` in `.env` if the API is hosted elsewhere. The Vite development server proxies `/v1` and `/health` to `http://localhost:8000`, so local development does not require a backend CORS change. For production, configure your reverse proxy or set `VITE_API_URL` to the API origin and enable a restrictive CORS allowlist on FastAPI if the frontend and API use different origins.

## Tests

```bash
npm run test
npm run test:e2e
```

The initial Playwright smoke test verifies that unauthenticated visitors are redirected to sign in. Expand unit, integration, and end-to-end coverage as each workflow is finalized.

## Production build

```bash
npm run build
npm run preview
```

The production bundle is generated in `dist/`.

## Implemented API integration

- `POST /v1/auth/signup` (JSON)
- `POST /v1/auth/login` (OAuth2 form: `username`, `password`)
- `GET /v1/tenant`
- `GET /v1/documents`, `POST /v1/documents`, `GET /v1/documents/{id}`
- `GET /v1/documents/{id}/content`, `GET /v1/documents/{id}/chunks`
- `POST /v1/documents/{id}/retry`, `DELETE /v1/documents/{id}`
- `POST /v1/query`
- `GET/POST/DELETE /v1/webhooks`
- `POST /v1/webhooks/{id}/ping`, `GET /v1/webhooks/{id}/deliveries`

Document processing is polled while the API reports a non-terminal status. The frontend does not assume object storage URLs or direct file access; document content is loaded through the authenticated API.

## Notes / current backend constraints

- Login returns only a token, not a user profile. The frontend therefore shows a generic account identity until a profile endpoint is added.
- The current API does not expose workspace editing, user/team management, billing, or plan changes; those screens/actions are intentionally not fabricated.
- Password reset is not exposed by the API; the login screen links to a support email placeholder.
- Query synthesis may be unavailable if the backend's optional LLM key is not configured. In that case, the UI still displays retrieved passages.
- Webhook signing secrets are shown once after creation, matching the backend contract.
- Upload currently supports the backend's allowed PDF, DOCX, TXT, and MD MIME types and 20 MB maximum configured in the supplied source.

## Production deployment note

If the frontend and API are served from different origins, configure FastAPI CORS with the exact frontend origin (not `*`) and allow the `Authorization` and `Content-Type` headers. The current supplied backend does not add CORS middleware.
