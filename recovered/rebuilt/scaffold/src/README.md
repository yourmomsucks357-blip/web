# Backend Prototype

This backend is framework-agnostic but fully wired as a service composition.

## Modules

1. routes/auth.ts: login, verify, logout with in-memory sessions.
2. routes/vehicles.ts: owner vehicle handlers and valuation endpoint.
3. routes/listings.ts: listing lifecycle plus offer signal demand updates.
4. routes/marketing.ts: UTM capture, lead events, and ad conversion export payloads.
5. routes/evaluator.ts: direct evaluator access by vehicle id.
6. routes/security.ts: sensitive-data scan and redaction services.

## Entry points

1. app.ts: compose database, routes, and self-check hooks.
2. server.ts: simulate startup and emit conversion export snapshot.