const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial';

export const fetchExchangeRate = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener tasa');
    const data = await response.json();
    return {
      rate: data.promedio || data.rate,
      date: data.fecha || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback por si la API falla
    return { rate: 38.50, date: new Date().toISOString().split('T')[0] };
  }
};