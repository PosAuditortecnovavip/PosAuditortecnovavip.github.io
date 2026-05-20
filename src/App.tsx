import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExchangeRateProvider } from './context/ExchangeRateContext';
import Login from './components/Login/Login';
import Navbar, { ViewId } from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import Sales from './components/Sales/Sales';
import Inventory from './components/Inventory/Inventory';
import Audit from './components/Audit/Audit';
import Finance from './components/Finance/Finance';
import Reports from './components/Reports/Reports';
import CustomersPage from './components/Customers/CustomersPage';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<ViewId>('dashboard');

  if (!isAuthenticated) return <Login />;

  return (
    <div className="min-h-screen bg-aurora text-text-primary">
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      <main className="max-w-7xl mx-auto p-3 md:p-8">
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'sales' && <Sales />}
        {activeView === 'inventory' && <Inventory />}
        {activeView === 'audit' && <Audit />}
        {activeView === 'finance' && <Finance />}
        {activeView === 'reports' && <Reports />}
        {activeView === 'customers' && <CustomersPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ExchangeRateProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ExchangeRateProvider>
  );
}