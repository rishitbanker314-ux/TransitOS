# Enterprise Engineering Blueprint

> [!IMPORTANT]
> This blueprint serves as the definitive engineering standard for the Odoo TransitOps platform. All future modules (Drivers, Trips, Maintenance, Fuel, Expenses, Vendors, Inventory, Notifications, Reports, Dashboard, Settings, AI Assistant) **MUST** strictly adhere to these architectural patterns, completely inheriting these standards without introducing custom paradigms.

---

## 1. Enterprise Module Blueprint

Every domain entity in the system is treated as a highly cohesive, loosely coupled **Module**. A module encapsulates its own data access, business logic, UI components, and types. The core philosophy is **Feature-First Architecture**, where files are grouped by feature rather than by technical concern globally.

### Principles:
- **Separation of Concerns:** UI never speaks directly to Firestore. Services handle business logic and RBAC. Repositories handle data access.
- **Fail-Fast Validation:** All inputs are strictly validated at the boundary using Zod (or equivalent) schemas.
- **Auditability by Default:** All mutations are transaction-based and logged.
- **Optimistic Locking:** Every document includes a `version` field incremented on update.

---

## 2. Standard Folder Structure

Every module must be housed under `src/features/[module-name]/` and adhere precisely to the following structure:

```text
src/features/[module-name]/
├── actions/            # Server actions (if using Next.js/React Server Components)
├── components/         # UI components strictly bound to this domain
│   ├── ui/             # Reusable domain-specific atomic components
│   ├── forms/          # Form components (e.g., ModuleCreateForm, ModuleEditForm)
│   ├── dialogs/        # Modals and Dialogs
│   └── tables/         # Data tables for list views
├── hooks/              # Custom React hooks (e.g., useModuleQuery, useModuleMutation)
├── repositories/       # Data Access Layer (e.g., module.repository.ts)
├── schemas/            # Validation schemas (e.g., module.schema.ts)
├── services/           # Business Logic Layer (e.g., module.service.ts)
├── types/              # TypeScript interfaces and type definitions (e.g., module.types.ts)
├── __tests__/          # Unit and integration tests
├── constants.ts        # Module-specific constants
└── index.ts            # Public API exports for the module
```

### Standard Files per Module:
- `README.md`: Domain context and module-specific notes.
- `types.ts`: Core interfaces (`Entity`, `CreateDTO`, `UpdateDTO`, `Status` enums).
- `constants.ts`: Pagination limits, default values, status lists.
- `validators.ts` / `schema.ts`: Zod schemas for input validation.
- `service.ts`: Business logic, transaction orchestration, RBAC.
- `repository.ts`: Firebase interactions (`getDoc`, `getDocs`, `query`).
- `hooks.ts`: React Query or SWR hooks for UI data fetching.
- `permissions.ts`: Role-based constants and policy checks.
- `routes.ts`: Route definitions and navigation helpers.
- `analytics.ts`: Telemetry and usage tracking events.
- `tests/`: High-coverage unit tests for services and repositories.

---

## 3. Backend Standards

### Layered Architecture
- **Controllers/Hooks:** Extract payload from the request/UI, pass to Service.
- **Service Layer (`[Entity]Service`):**
  - **RBAC Check:** `this.permissions.requireRole([...])` as the very first line.
  - **Validation:** `schema.parse(payload)` immediately following RBAC.
  - **Business Rules:** Execute domain-specific logic.
  - **Orchestration:** Use `runTransaction(db, async (transaction) => { ... })` for all mutations.
  - **Audit Logging:** Call `this.audit.logTransaction(...)` within the transaction block.
- **Repository Layer (`[Entity]Repository`):**
  - Sole responsibility is constructing Firestore queries, typed document reads, and mapping documents to Domain Types.
  - **No business logic or throwing domain errors** in repositories.

### Error Handling
- Use standard error prefixes: `DUPLICATE_RESOURCE`, `NOT_FOUND`, `INVALID_STATE`, `UNAUTHORIZED`, `VALIDATION_ERROR`.
- Example: `throw new Error('INVALID_STATE: Only Available entities can be archived.');`

---

## 4. Firestore Standards

### Document Schema
Every core entity document MUST include the following base fields:
```typescript
{
  id: string;               // UUID / Firestore ID
  status: EntityStatus;     // Strictly typed union or enum (e.g., 'Available' | 'Active' | 'Archived')
  isArchived: boolean;      // Soft delete flag
  version: number;          // Optimistic locking (starts at 1, incremented on update)
  createdAt: string;        // ISO 8601 String
  createdBy: string;        // User ID
  updatedAt?: string;       // ISO 8601 String
  updatedBy?: string;       // User ID
}
```

### Database Conventions
- **Collections:** Plural, snake_case (e.g., `maintenance_records`, `trip_logs`).
- **Uniqueness Constraints:** Handled via shadow collections mapping unique keys to document IDs (e.g., `vehicle_registrations` mapping `registrationNumber -> vehicleId`).
- **Soft Deletes:** Never delete documents. Update `isArchived: true` and `status: 'Archived'`.
- **Transactions:** Any operation writing to >1 document, or depending on a read for a write, must be wrapped in `runTransaction`.
- **Pagination:** Implement cursor-based pagination using `startAfter(cursor)` with a standard limit (e.g., 50).
- **Indexes:** Composite indexes must be documented in `firestore.indexes.json` before deployment.

---

## 5. Design System Standards

The UI must feel highly premium, dynamic, and strictly consistent. 

- **Typography & Spacing:** Use modern sans-serif (e.g., Inter). Use strict spacing tokens (4, 8, 16, 24, 32px).
- **Components:**
  - **Cards:** Subtle borders, glassmorphism in dark mode, hover elevations (micro-animations).
  - **Tables:** Sticky headers, virtualized rows for large datasets, skeleton loaders during fetch, inline empty states.
  - **Forms:** Real-time inline validation, disabled submit buttons during mutation, clear error boundaries.
  - **Dialogs:** Used for destructive actions (Confirmations) or quick creates. Complex creates must be full pages.
  - **Badges:** Status indicators must be color-coded (Green: Active, Red: Critical, Gray: Inactive, Blue: In Progress) with subtle backgrounds.
- **Dark Mode:** Native support required. Avoid absolute black; use deep grays.
- **Loading & Empty States:** Skeleton loaders over spinners for layout stability. Empty states must have an illustration, a clear description, and a primary call-to-action.
- **Accessibility:** ARIA labels on all icon buttons, keyboard navigation on tables, and contrast compliance.

---

## 6. Performance Standards

- **Minimal Reads:** Utilize Firestore caching. Only fetch what is displayed.
- **Pagination & Virtualization:** Lists > 50 items must be paginated at the database level and virtualized at the DOM level.
- **Bundle Splitting:** Lazy load heavy components (e.g., Charts, Maps) using React `lazy` or Next.js `dynamic`.
- **Memoization:** Wrap expensive pure components in `React.memo`. Use `useMemo` for derived client-side calculations (like filtering).
- **Realtime Optimization:** Use `onSnapshot` sparingly. Only attach listeners to active, visible entities. Detach immediately on unmount.

---

## 7. Security Standards

- **RBAC (Role-Based Access Control):** Validated on both Client (UI hiding) and Server (Service execution).
- **Firestore Rules:** Deny all by default. Explicitly allow based on request auth and custom claims.
  ```javascript
  match /vehicles/{vehicleId} {
    allow read: if isAuthenticated();
    allow write: if hasRole('admin') || hasRole('fleet_manager');
  }
  ```
- **Audit Logging:** Every state change logs: Entity ID, Entity Type, Action, Old Data, New Data, and User ID.
- **Input Validation:** Zod schemas are non-negotiable. Trust no client input.

---

## 8. AI Standards

AI integrations (e.g., Gemini) must follow strict operational boundaries:
- **Read-Only:** AI is strictly prohibited from executing mutations on production data. It can *propose* a payload that a user must manually approve.
- **Structured Outputs:** Force AI to return data in strictly defined JSON schemas.
- **Prompt Architecture:** Include systemic constraints, context (schema definition), user intent, and fallback behavior in every prompt.
- **Hallucination Prevention:** Ground the model by injecting retrieved database context (RAG) rather than relying on parametric memory.

---

## 9. Module Checklist

Before any module PR is merged, it must pass the following checks:
- [ ] **Authentication:** Protected routes established.
- [ ] **Permissions:** UI elements conditionally rendered; Service-level RBAC enforced.
- [ ] **Validation:** Zod schemas defined for all inputs/DTOs.
- [ ] **Firestore:** `isArchived`, `version`, and audit logging correctly implemented in transactions.
- [ ] **Tests:** Service logic and Repositories have unit tests.
- [ ] **Accessibility:** Axe-core checks passed, ARIA roles correct.
- [ ] **Responsive:** Renders correctly on mobile, tablet, and desktop viewports.
- [ ] **Production Ready:** No console logs, no `any` types, strict TypeScript compilation.

---

## 10. Prompt Blueprint

To generate future modules, apply this exact prompt template:

```text
# OBJECTIVE
Generate the [Module Name] module following the Enterprise Engineering Blueprint.

# 1. DISCOVERY
Analyze relationships with existing modules (e.g., Vehicles, Drivers).

# 2. FIRESTORE DESIGN
Define the Collection schema, shadow collections for uniqueness, and Indexes. Include base fields (id, version, isArchived).

# 3. BACKEND
Generate `[module].schema.ts` (Zod), `[module].repository.ts`, and `[module].service.ts` with RBAC and Audit logging.

# 4. FRONTEND ARCHITECTURE
Generate hooks for fetching/mutating. Create the list Table, Create Form, and Detail View applying Design System Standards.

# 5. BUSINESS RULES
Implement status state machines (e.g., Active -> Maintenance -> Retired).

# 6. AI & ANALYTICS
Embed tracking events. If applicable, define AI read-only prompt tools.

# 7. PRODUCTION REVIEW
Ensure strict typing, error boundaries, and loading states are present.
```

---

## 11. Engineering Playbook

- **Coding Standards:** TypeScript Strict Mode. Use descriptive variable names (`vehicleRegistrationNumber` not `regNum`). Use early returns.
- **Code Review:** 2 approvals required. Reviewers must check for transaction safety and RBAC boundaries.
- **Testing Strategy:** Services require 90% logic coverage. Mock Firestore repositories. 
- **Deployment Process:** Staging deployment -> Automated E2E -> Manual QA -> Production Promotion.

---

## 12. Self Review & Architectural Validation

*Analysis:*
- The established architecture effectively separates data access, business logic, and UI.
- The use of `runTransaction` coupled with shadow collections (e.g., `vehicle_registrations`) guarantees data integrity and uniqueness without complex Cloud Functions.
- The enforced base fields (`version`, `isArchived`) ensure that optimistic concurrency and soft deletes are standard across the platform, preventing accidental data loss.
- By inheriting this blueprint, modules like Drivers or Trips will naturally align with the exact patterns defined in Vehicles, ensuring zero architectural drift.
- **Conclusion:** The blueprint is highly reusable, strictly defined, and completely abstracts out duplicated efforts for future module implementations.
