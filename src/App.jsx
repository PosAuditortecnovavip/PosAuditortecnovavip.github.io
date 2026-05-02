import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Sales } from './components/Sales/Sales';
import { Audit } from './components/Audit/Audit';
import { useExchangeRate } from './hooks/useExchangeRate';
import { InventoryProvider, useInventory } from './context/InventoryContext';

const DashboardWrapper = ({ exchangeRate, loading, convertUSDtoVES }) => {
  const { inventory } = useInventory();
  const total = inventory.reduce((sum, item) => sum + (item.costUSD * item.stock), 0);
  return (
    <Dashboard
      exchangeRate={exchangeRate}
      loading={loading}
      convertUSDtoVES={convertUSDtoVES}
      totalInventoryUSD={total}
    />
  );
};

export default function App() {
  const { exchangeRate, loading, convertUSDtoVES } = useExchangeRate();

  return (
    <InventoryProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={
              <DashboardWrapper
                exchangeRate={exchangeRate}
                loading={loading}
                convertUSDtoVES={convertUSDtoVES}
              />
            } />
            <Route path="ventas" element={
              <Sales
                exchangeRate={exchangeRate}
                convertUSDtoVES={convertUSDtoVES}
              />
            } />
            <Route path="auditoria" element={
              <Audit convertUSDtoVES={convertUSDtoVES} />
            } />
          </Route>
        </Routes>
      </HashRouter>
    </InventoryProvider>
  );
}
