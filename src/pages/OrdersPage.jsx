import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function OrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
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

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px' }}>Мои заказы</h1>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h2>У вас пока нет заказов</h2>
          <p style={{ color: '#666', margin: '20px 0' }}>
            Начните покупки прямо сейчас
          </p>
          <Link 
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div 
              key={order.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>Заказ #{order.id}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    {new Date(order.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                  <p style={{ 
                    margin: '10px 0 0 0',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}>
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Товары в заказе */}
              <div style={{ marginBottom: '15px' }}>
                {order.items.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '10px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <img 
                      src={item.product?.image_url || 'https://via.placeholder.com/60'}
                      alt={item.title}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                        {item.title}
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {item.quantity} шт. × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Адрес доставки */}
              <div style={{ 
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>
                  📍 Адрес доставки:
                </p>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  {order.shipping_address}
                </p>
              </div>

              {/* Кнопка деталей */}
              <Link 
                to={`/orders/${order.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Подробнее о заказе
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;