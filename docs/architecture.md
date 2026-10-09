# PERSPECTIVES architecture foundation

Phase 2 establishes the boundaries for a sensitive-data full-stack application.

- `apps/web` owns the browser experience and will call the API; the existing landing page remains preserved at the repository root during this foundation phase.
- `apps/api` owns HTTP transport, security middleware, validation boundaries, database access, and future domain modules.
- `apps/admin` is reserved for a separately protected operations interface.
- `packages/shared` owns small, non-sensitive contracts shared by applications.

The web foundation now provides `BrowserRouter` and a shared TanStack Query client. Tailwind is available through `src/tailwind.css`; existing branded CSS remains the visual source of truth until the UI is migrated intentionally.

The API health route intentionally does not connect to MongoDB when the app is imported by tests. Database connection happens in `server.ts`, so route tests remain deterministic and do not require a running database.

Logging is configured with redaction for authorization and cookie headers. Future modules must never log passwords, tokens, intake content, private messages, or verification documents.
