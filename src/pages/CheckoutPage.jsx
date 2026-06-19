import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import YooKassaCheckout from '../components/YooKassaCheckout';

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null); // ✅ Добавьте состояние для заказа

  // Если корзина пуста - перенаправляем
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Если не авторизован - перенаправляем на логин
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // ✅ БЕРЕМ URL ИЗ ПЕРЕМЕННОЙ ОКРУЖЕНИЯ
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/orders`, // ✅ ИСПРАВЛЕНО: используем API_URL
        {
          items: cartItems,
          shipping_address: shippingAddress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Сохраняем заказ в состояние
      setOrder(response.data.order); // ✅ Сохраняем заказ

      // Очищаем корзину (только после успешной оплаты, но пока можно)
      // clearCart(); // ⚠️ Лучше очищать после оплаты

    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px' }}>Оформление заказа</h1>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* ✅ Если заказ создан — показываем оплату */}
      {order ? (
        <div>
          <div style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2>✅ Заказ #{order.id} создан!</h2>
            <p>Общая сумма: ${order.total_amount}</p>
            <p>Статус: {order.status}</p>
          </div>

          <YooKassaCheckout
            orderId={order.id}
            amount={order.total_amount}
            description={`Оплата заказа #${order.id}`}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Форма доставки */}
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Адрес доставки</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Полный адрес
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  rows={4}
                  placeholder="Город, улица, дом, квартира..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !shippingAddress}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: loading || !shippingAddress ? '#bdc3c7' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading || !shippingAddress ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Создание заказа...' : 'Подтвердить заказ'}
              </button>
            </form>
          </div>

          {/* Сводка заказа */}
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Ваш заказ</h2>
            
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px'
            }}>
              {cartItems.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      {item.title} × {item.quantity}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid #2c3e50',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                <span>Итого:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;