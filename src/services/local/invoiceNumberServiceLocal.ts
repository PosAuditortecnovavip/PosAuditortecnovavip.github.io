const STORAGE_KEY = 'audity_invoice_counter';

interface CounterData {
  current: number;
  month: string; // formato "MMAA"
}

const getMonthKey = (): string => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);
  return `${month}${year}`;
};

export const getNextInvoiceNumberLocal = (): string => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let data: CounterData;

  if (stored) {
    data = JSON.parse(stored);
    const currentMonth = getMonthKey();
    if (data.month !== currentMonth) {
      data = { current: 1, month: currentMonth };
    } else {
      data.current += 1;
    }
  } else {
    data = { current: 1, month: getMonthKey() };
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  const paddedNumber = data.current.toString().padStart(4, '0');
  return `${data.month}-${paddedNumber}`;
};