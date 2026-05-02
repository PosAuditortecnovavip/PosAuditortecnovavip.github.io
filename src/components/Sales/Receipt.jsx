import { Printer, X } from 'lucide-react';

export const ReceiptModal = ({ product, quantity, totalVES, exchangeRate, onClose }) => {
  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-auto animate-fade-in bg-white text-black">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recibo de Compra</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="border-t border-gray-300 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Producto:</span>
            <span className="font-medium">{product.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cantidad:</span>
            <span>{quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tasa:</span>
            <span>Bs. {exchangeRate?.rate?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span className="text-green-600">{totalVES}</span>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={printReceipt}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};