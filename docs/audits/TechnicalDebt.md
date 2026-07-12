# Technical Debt & Maintainability

**Target**: TransitOps Vehicle Management Module

## Executive Summary
The codebase is clean, but a few areas will accumulate debt if not standardized now.

## 1. Mock Data & Missing Backend Hooks (High Priority)
- **Issue:** Several services (e.g., `FleetAnalyticsService.ts`, `VehicleSearchAI.actions.ts`) currently implement mock timeouts and fake data generation to simulate production behaviors.
- **Debt:** If left unchecked, these mocks will leak into production.
- **Resolution:** Remove mock generation and hook directly to the production Firestore collections and Google GenAI SDK before final build.

## 2. Hardcoded Strings (Medium Priority)
- **Issue:** Statuses (e.g., 'Active', 'UnderMaintenance') and roles are occasionally passed as raw strings.
- **Debt:** Prone to typos and refactoring nightmares.
- **Resolution:** Ensure `VehicleStatus` and `UserRole` enums/types are exported from a central `constants.ts` or `types.ts` and strictly enforced.

## 3. Testing Coverage (High Priority)
- **Issue:** Clean Architecture relies on testability, but the actual test suites (`.test.ts` or `.spec.ts`) are currently absent.
- **Debt:** Regressions during status engine modifications.
- **Resolution:** Implement Jest/Vitest covering at least:
  - `VehicleStatusEngine` (State machine transitions)
  - `VehicleHealthEngine` (Scoring logic)
  - `vehicle.schema.ts` (Zod validations)

## 4. Global State vs URL State (Low Priority)
- **Issue:** Search filters are heavily state-based.
- **Debt:** Users cannot bookmark or share links to specific filtered views (e.g., "All Active Volvos").
- **Resolution:** Migrate search and filter state from `useState` to URL Search Params (using `nuqs` or Next.js `useSearchParams`).

## Conclusion
Addressing the mock data replacements, test coverage, and URL state will elevate the module from "architecturally sound" to "production bulletproof."
