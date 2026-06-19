import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function AdminPanel() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Проверка прав доступа
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadData(); // Перезагружаем данные
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadData();
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
    }
  };

  if (loading) return <div>Загрузка админ-панели...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>👑 Админ-панель</h1>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('dashboard')} style={tabStyle(activeTab === 'dashboard')}>
          📊 Статистика
        </button>
        <button onClick={() => setActiveTab('users')} style={tabStyle(activeTab === 'users')}>
          👥 Пользователи
        </button>
        <button onClick={() => setActiveTab('orders')} style={tabStyle(activeTab === 'orders')}>
          📦 Заказы
        </button>
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <StatCard title="Пользователей" value={stats.users} color="#3498db" />
          <StatCard title="Товаров" value={stats.products} color="#2ecc71" />
          <StatCard title="Заказов" value={stats.orders} color="#e67e22" />
          <StatCard title="Выручка" value={`$${stats.revenue?.toFixed(2) || 0}`} color="#e74c3c" />
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                    >
                      <option value="BUYER">Покупатель</option>
                      <option value="SELLER">Продавец</option>
                      <option value="ADMIN">Администратор</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div>
          {orders.map(order => (
            <div key={order.id} style={orderCardStyle}>
              <div>
                <strong>Заказ #{order.id}</strong>
                <span style={{ marginLeft: '10px', color: '#666' }}>
                  {order.user?.email}
                </span>
              </div>
              <div>
                <span style={{ marginRight: '10px' }}>Сумма: ${order.total_amount}</span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="PENDING">Ожидает</option>
                  <option value="PAID">Оплачен</option>
                  <option value="SHIPPED">Отправлен</option>
                  <option value="DELIVERED">Доставлен</option>
                  <option value="CANCELLED">Отменен</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Вспомогательные компоненты
const StatCard = ({ title, value, color }) => (
  <div style={{
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: `3px solid ${color}`,
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{value}</div>
    <div style={{ color: '#666' }}>{title}</div>
  </div>
);

const tabStyle = (active) => ({
  padding: '10px 20px',
  backgroundColor: active ? '#2c3e50' : '#f0f0f0',
  color: active ? 'white' : '#333',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

const orderCardStyle = {
  padding: '15px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

export default AdminPanel;