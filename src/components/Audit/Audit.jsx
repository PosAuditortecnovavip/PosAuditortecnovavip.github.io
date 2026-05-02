import { useState } from 'react';
import { BlindCount } from './BlindCount';
import { DiscrepancyReport } from './DiscrepancyReport';
import { StockTable } from './StockTable';

export const Audit = ({ inventory, convertUSDtoVES }) => {
  const [discrepancies, setDiscrepancies] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleBlindCountComplete = (results) => {
    setDiscrepancies(results);
    setShowReport(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Auditoría de Inventario</h1>
      
      {!showReport ? (
        <>
          <StockTable inventory={inventory} />
          <BlindCount 
            inventory={inventory} 
            onComplete={handleBlindCountComplete} 
          />
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
          className="mt-4 px-4 py-2 bg-dark-700 rounded-lg text-dark-500 hover:text-white"
        >
          ← Nueva Auditoría
        </button>
      )}
    </div>
  );
};