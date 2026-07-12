import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './features/demo-mode/context/DemoContext';
import { ErrorBoundary } from './components/ui/error-boundary';
import { AuthPage } from './pages/AuthPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { FleetPage } from './pages/FleetPage';
import { DriversPage } from './pages/DriversPage';
import { TripsPage } from './pages/TripsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { FuelExpensesPage } from './pages/FuelExpensesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="fuel" element={<FuelExpensesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </ErrorBoundary>
  );
}
