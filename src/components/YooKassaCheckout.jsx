import { useState } from 'react';
import axios from 'axios';

function YooKassaCheckout({ orderId, amount, description }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ БЕРЁМ URL ИЗ ПЕРЕМЕННОЙ ОКРУЖЕНИЯ
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ ИСПРАВЛЕНО: используем полный URL
      const response = await axios.post(`${API_URL}/api/payments/create-payment`, {
        orderId,
        amount,
        description,
      });

      // Перенаправляем на страницу оплаты ЮKassa
      window.location.href = response.data.confirmationUrl;
    } catch (err) {
      console.error('Ошибка оплаты:', err);
      setError(err.response?.data?.error || 'Ошибка при создании платежа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: loading ? '#bdc3c7' : '#f39c12',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Подготовка оплаты...' : '💰 Оплатить через ЮKassa'}
      </button>
      {error && (
        <div style={{ color: '#e74c3c', marginTop: '10px' }}>{error}</div>
      )}
    </div>
  );
}

export default YooKassaCheckout;