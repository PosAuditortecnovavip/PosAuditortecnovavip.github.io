import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../hooks/useFinance';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { generateFinanceReport } from '../../utils/pdfGenerator';
import BalanceSummary from './BalanceSummary';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function Finance() {
  const { transactions, addExpense, balance, refresh, totalSalesUSD } = useFinance();
  const { rate } = useExchangeRate();
  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = (description: string, amountUSD: number, _type: 'expense', category: string) => {
    addExpense(description, amountUSD, category);
    setShowForm(false);
  };

  const handleReport = () => {
    generateFinanceReport(transactions, balance, rate?.rate || 0, totalSalesUSD);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Finanzas</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Ingresos (ventas) y egresos</p>
        </div>
        <button
          onClick={handleReport}
          disabled={transactions.length === 0 && totalSalesUSD === 0}
          className="glass-card px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition disabled:opacity-40"
        >
          Descargar Reporte PDF
        </button>
      </div>

      <BalanceSummary balance={balance} />

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-danger/80 hover:bg-danger rounded-xl text-sm font-bold text-white transition"
        >
          {showForm ? 'Cancelar' : 'Registrar Egreso'}
        </button>
      </div>

      {showForm && (
        <TransactionForm onSubmit={handleAddExpense} onCancel={() => setShowForm(false)} />
      )}

      <TransactionList transactions={transactions} />
    </motion.div>
  );
}