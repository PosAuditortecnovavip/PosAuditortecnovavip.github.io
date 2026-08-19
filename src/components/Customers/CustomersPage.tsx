import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../../hooks/useCustomers';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';
import { Customer } from '../../types';

export default function CustomersPage() {
  const { customers, add, update, remove } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: { name: string; phone: string; email: string }) => {
    if (editingCustomer) {
      update(editingCustomer.id, data);
    } else {
      add(data);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Clientes</h1>
        <p className="text-text-secondary mt-1">Gestión de clientes frecuentes</p>
      </div>

      {showForm ? (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingCustomer(null); }}
        />
      ) : (
        <CustomerList
          customers={customers}
          onEdit={(cust) => { setEditingCustomer(cust); setShowForm(true); }}
          onDelete={remove}
          onAdd={() => { setEditingCustomer(null); setShowForm(true); }}
        />
      )}
    </motion.div>
  );
}