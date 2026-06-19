import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ✅ Берем URL из переменной окружения
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function SellerDashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Проверка, что пользователь - продавец
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'SELLER') {
      alert('Доступ только для продавцов');
      navigate('/');
      return;
    }

    fetchSellerProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchSellerProducts = async () => {
    try {
      // ✅ Исправлено: используем API_URL
      const response = await axios.get(`${API_URL}/api/products/seller`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      // ✅ Исправлено: используем API_URL
      await axios.delete(`${API_URL}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Удаляем товар из списка
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      alert('Ошибка удаления товара');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Панель продавца</h1>
        <Link 
          to="/seller/products/add"
          style={{
            padding: '12px 24px',
            backgroundColor: '#27ae60',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          + Добавить товар
        </Link>
      </div>

      {/* Статистика */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#3498db',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Всего товаров</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {products.length}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#27ae60',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>В наличии</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {products.filter(p => p.stock_quantity > 0).length}
          </p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#e74c3c',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Нет в наличии</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
            {products.filter(p => p.stock_quantity === 0).length}
          </p>
        </div>
      </div>

      {/* Список товаров */}
      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h2>У вас пока нет товаров</h2>
          <p style={{ color: '#666', margin: '20px 0' }}>
            Добавьте свой первый товар
          </p>
          <Link 
            to="/seller/products/add"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#27ae60',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Добавить товар
          </Link>
        </div>
      ) : (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Товар</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Цена</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Остаток</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Категория</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/50'}
                        alt={product.title}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{product.title}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    ${product.price}
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: product.stock_quantity > 0 ? '#d4edda' : '#f8d7da',
                      color: product.stock_quantity > 0 ? '#155724' : '#721c24',
                      fontSize: '12px'
                    }}>
                      {product.stock_quantity} шт.
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                    {product.category?.name || 'Не указана'}
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
