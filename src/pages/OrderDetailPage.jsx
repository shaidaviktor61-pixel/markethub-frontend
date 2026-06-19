import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ✅ Берем URL из переменной окружения
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function OrderDetailPage() {
  const { orderId } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchOrder();
  }, [orderId, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      // ✅ Исправлено: используем API_URL
      const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки заказа:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#f39c12';
      case 'PAID': return '#3498db';
      case 'SHIPPED': return '#9b59b6';
      case 'DELIVERED': return '#27ae60';
      case 'CANCELLED': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Ожидает оплаты';
      case 'PAID': return 'Оплачен';
      case 'SHIPPED': return 'Отправлен';
      case 'DELIVERED': return 'Доставлен';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }

  if (!order) {
    return <div style={{ padding: '20px' }}>Заказ не найден</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <Link 
        to="/orders" 
        style={{ 
          color: '#3498db', 
          textDecoration: 'none',
          marginBottom: '20px',
          display: 'inline-block'
        }}
      >
        ← Назад к списку заказов
      </Link>

      <h1 style={{ marginBottom: '30px' }}>Заказ #{order.id}</h1>

      {/* Статус заказа */}
      <div style={{
        padding: '20px',
        backgroundColor: getStatusColor(order.status),
        color: 'white',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{getStatusText(order.status)}</h2>
        <p style={{ margin: 0, fontSize: '14px' }}>
          {new Date(order.created_at).toLocaleString('ru-RU')}
        </p>
      </div>

      {/* Информация о заказе */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Информация о заказе</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Номер заказа:</p>
          <p style={{ margin: 0, color: '#666' }}>#{order.id}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Дата создания:</p>
          <p style={{ margin: 0, color: '#666' }}>
            {new Date(order.created_at).toLocaleString('ru-RU')}
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Адрес доставки:</p>
          <p style={{ margin: 0, color: '#666' }}>{order.shipping_address}</p>
        </div>

        <div>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Общая сумма:</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            ${parseFloat(order.total_amount).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Товары в заказе */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Товары в заказе</h3>

        {order.items.map(item => (
          <div 
            key={item.id}
            style={{
              display: 'flex',
              gap: '15px',
              padding: '15px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            <img 
              src={item.product?.image_url || 'https://via.placeholder.com/80'}
              alt={item.title}
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0' }}>{item.title}</h4>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                Количество: {item.quantity} шт.
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Цена за шт.: ${item.price}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetailPage;
