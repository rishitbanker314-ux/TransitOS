# TransitOps - Smart Transport Operations Platform

TransitOps is a centralized, enterprise-grade fleet management and transport operations platform designed to eliminate scheduling conflicts, automate vehicle lifecycles, and optimize operational efficiency. Built to move logistics tracking away from manual spreadsheets, TransitOps enforces strict business rules around vehicle dispatching, driver compliance, maintenance status tracking, and financial overhead metrics.

---

## 🚀 Key Features & Enterprise Workflows

### 1. Unified Operational Dashboard
* **KPI Metrics:** Real-time visibility into active fleets, pending maintenance requests, driver utilization, and overall vehicle ROI.
* **Smart Analytics:** Live cost analysis displaying combined Fuel vs. Maintenance expense charts.

### 2. Vehicle & Driver Registries (CRUD)
* **Fleet Management:** Detailed tracking of maximum load capacity, registration tracking, odometer telemetry, and vehicle allocation statuses.
* **Compliance Control:** Driver records including licensing status, expiry tracking, and immediate status updates (`Available` vs. `On Trip`).

### 3. Automated Trip Engine & Dispatch Rules
* **Capacity Safeguards:** Automatically flags and blocks dispatch requests if the planned cargo weight exceeds the specific vehicle’s maximum capacity payload ($Cargo\ Weight > Max\ Capacity$).
* **State Automations:** Initiating a trip automatically cascades status updates, locking both the specific vehicle and assigned driver records to `On Trip` status. Completing a trip updates the lifetime odometer logs and returns both assets to `Available`.

### 4. Preventive Maintenance Flow
* **Shop Locks:** Filing a maintenance request automatically shifts the target vehicle state to `In Shop`. Vehicles marked as `In Shop` are immediately dynamically excluded from all subsequent dispatch scheduling dropdowns to avoid operational conflicts.
* **Return-to-Service Automation:** Resolving and closing the maintenance ticket reverts the vehicle status back to `Available`.

### 5. Financial & Fuel Tracking
* **Telemetry Insights:** Fuel efficiency logging calculated from trip fuel consumption against odometer delta changes.
* **Expense Accountability:** Structured tracking for tolls, breakdown repairs, permits, and operational outlays.

---

## 🛠️ Technology Stack & System Architecture

The platform architecture decouples modern frontend interactive states from robust cloud-native authentication frameworks.

* **Frontend Layout:** Next.js (React) styled using Tailwind CSS for a fully responsive, enterprise-scale administration layout.
* **Database & Cloud Functions:** Firebase Firestore for low-latency document sync and Firebase Authentication natively providing Role-Based Access Control (RBAC).
* **AI Orchestration Framework:** Localized agent orchestration frameworks for rapid layout components generation and math logic validations.

---

## 📊 Core Data Entities
* **Users / Roles:** Identity management maps to system roles (`Fleet Manager`, `Driver`, `Safety Officer`, `Financial Analyst`).
* **Vehicles:** `id`, `name`, `license_plate`, `max_capacity`, `status` (`Available`, `On Trip`, `In Shop`, `Retired`), `current_odometer`.
* **Drivers:** `id`, `name`, `license_number`, `license_expiry`, `status` (`Available`, `On Trip`, `Suspended`).
* **Trips:** `id`, `vehicle_id`, `driver_id`, `cargo_weight`, `start_odometer`, `end_odometer`, `fuel_consumed`, `status` (`Scheduled`, `On Trip`, `Completed`).
* **Maintenance Logs:** `id`, `vehicle_id`, `description`, `cost`, `entry_date`, `completion_date`, `status` (`Open`, `Closed`).
* **Fuel & Expense Logs:** `id`, `trip_id`, `amount`, `type` (`Fuel`, `Toll`, `Repair`, `Other`), `timestamp`.

---

## 💻 Getting Started & Local Setup

### Prerequisites
* Node.js (v18+ recommended)
* A Firebase Project instance initialized via the Google Cloud Console.

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)[your-username]/transitops.git
   cd transitops
   Setup Frontend Dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory and connect your Firebase web application keys:

Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
Run the local development server:

Bash
npm run dev
Open http://localhost:3000 inside your web browser to test the deployment layout.

***

Have your teammate create the `README.md` file in the main repository, paste this exact markdown code inside, and commit it with a clear description like `docs: initialize readme with architecture and entity maps`. This will ensure they are credited as an active code contributor on the team portal right away.
