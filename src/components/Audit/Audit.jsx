import { useState } from 'react';
import { BlindCount } from './BlindCount';
import { DiscrepancyReport } from './DiscrepancyReport';
import { StockTable } from './StockTable';
import { useInventory } from '../../context/InventoryContext';

export const Audit = ({ convertUSDtoVES }) => {
  const { inventory } = useInventory();
  const [discrepancies, setDiscrepancies] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleBlindCountComplete = (results) => {
    setDiscrepancies(results);
    setShowReport(true);
  };

  return (
    <div className="space-y-6 page-enter">
      <h1 className="text-3xl font-bold gradient-text">Auditoría de Inventario</h1>
      {!showReport ? (
        <>
          <StockTable inventory={inventory} />
          <BlindCount inventory={inventory} onComplete={handleBlindCountComplete} />
        </>
      ) : (
        <DiscrepancyReport
          discrepancies={discrepancies}
          convertUSDtoVES={convertUSDtoVES}
        />
      )}
      {showReport && (
        <button
          onClick={() => setShowReport(false)}
          className="mt-4 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all flex items-center space-x-2"
        >
          <span>← Nueva Auditoría</span>
        </button>
      )}
    </div>
  );
};
