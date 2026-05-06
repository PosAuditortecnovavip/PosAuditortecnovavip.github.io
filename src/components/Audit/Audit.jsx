import { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
          Auditoría de Inventario
        </h1>
        <p className="text-neutral-400 text-sm mt-1">Conteo ciego y detección de discrepancias</p>
      </div>

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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReport(false)}
          className="mt-4 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-all flex items-center space-x-2"
        >
          <span>← Nueva Auditoría</span>
        </motion.button>
      )}
    </motion.div>
  );
};
