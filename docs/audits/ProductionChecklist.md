# Production Deployment Checklist

**Project**: TransitOps Vehicle Management

## 1. Security & Rules
- [ ] Deploy Firestore Security Rules strictly enforcing RBAC.
- [ ] Deploy Firebase Storage Rules securing Vehicle Documents.
- [ ] Verify App Check is enabled to prevent unauthorized API calls.
- [ ] Rotate all development keys and ensure Gemini API keys are secured in production environment variables.

## 2. Database & Data Model
- [ ] Deploy all required Composite Indexes (`firestore.indexes.json`).
- [ ] Deploy the Cloud Function responsible for aggregating `analytics/fleet_snapshot` on a cron schedule.
- [ ] Ensure TTL (Time-To-Live) policies are set for ephemeral documents (like temporary UI state or notifications).

## 3. Performance & UI
- [ ] Implement `@tanstack/react-virtual` for all main table views.
- [ ] Migrate component state filters to URL Search Params for bookmarking.
- [ ] Verify Next.js caching strategy (`revalidate` tags) is correctly configured for layout data.

## 4. AI Integration
- [ ] Finalize Gemini prompt templates with strict structured output instructions.
- [ ] Implement retry and exponential backoff logic for AI actions.
- [ ] Set strict token limits in production to prevent runaway costs.
- [ ] Verify AI output is strictly read-only and heavily validated before display.

## 5. Observability & Monitoring
- [ ] Integrate Sentry or Datadog for React Error Boundaries and unhandled promise rejections.
- [ ] Ensure `AuditService` is piping critical events to a scalable log sink.
- [ ] Setup Firebase Alerts for 4xx/5xx errors, high latency, and billing anomalies.

## 6. Testing & Quality Assurance
- [ ] Achieve 90%+ coverage on core Business Logic (`VehicleStatusEngine`, `VehicleHealthEngine`).
- [ ] Run Lighthouse Audit - target >90 across Performance, Accessibility, Best Practices, and SEO.
- [ ] Run a manual E2E test of the entire vehicle lifecycle (Registration -> Assign -> Maintenance -> Retire).

## 7. Disaster Recovery
- [ ] Verify Google Cloud backup schedules are active for Firestore.
- [ ] Document the process for rolling back an accidental bulk vehicle deletion.
- [ ] Verify Firebase Storage bucket versioning/backups.
