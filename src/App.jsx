import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Sales } from './components/Sales/Sales';
import { Audit } from './components/Audit/Audit';
import { useExchangeRate } from './hooks/useExchangeRate';
import { mockInventory } from './data/mockData';

export default function App() {
  const { exchangeRate, loading, convertUSDtoVES } = useExchangeRate();

  const calculateTotalInventoryUSD = () => {
    return mockInventory.reduce((total, item) => total + (item.costUSD * item.stock), 0);
  };

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={
            <Dashboard 
              exchangeRate={exchangeRate}
              loading={loading}
              convertUSDtoVES={convertUSDtoVES}
              totalInventoryUSD={calculateTotalInventoryUSD()}
            />
          } />
          <Route path="ventas" element={
            <Sales 
              exchangeRate={exchangeRate}
              convertUSDtoVES={convertUSDtoVES}
              inventory={mockInventory}
            />
          } />
          <Route path="auditoria" element={
            <Audit 
              inventory={mockInventory}
              convertUSDtoVES={convertUSDtoVES}
            />
          } />
        </Route>
      </Routes>
    </HashRouter>
  );
}