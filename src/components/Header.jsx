import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

// ✅ Берем URL из переменной окружения
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { searchText, setSearchText, selectedCategory, setSelectedCategory } = useSearch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Коробка для категорий (загружаем с сервера)
  const [categories, setCategories] = useState([]);

  // Загружаем категории при загрузке Header
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // ✅ Исправлено: используем API_URL
        const response = await axios.get(`${API_URL}/api/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Логотип и бургер-меню */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Бургер-меню для мобильных */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px'
            }}
            className="mobile-menu-button"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <Link to="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            🏪 MarketHub
          </Link>
        </div>

        {/* Поиск и фильтр по категории */}
        <div style={{ flex: 1, display: 'flex', gap: '10px', maxWidth: '600px', minWidth: '300px' }}>
          {/* Поле поиска */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Поиск товаров..."
            style={{
              flex: 2,
              padding: '10px 15px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          
          {/* Фильтр по категории */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">Все категории</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Правая часть - десктоп */}
        <div 
          className="desktop-menu"
          style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
        >
          {/* Корзина */}
          <Link to="/cart" style={{ 
            color: 'white', 
            textDecoration: 'none',
            position: 'relative',
            fontSize: '24px',
            padding: '5px'
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                minWidth: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                padding: '0 5px'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <>
              {user.role === 'SELLER' && (
                <Link to="/seller/dashboard" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                  📊 Панель продавца
                </Link>
              )}
              
              <Link to="/orders" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                📦 Мои заказы
              </Link>
              
              <span style={{ color: 'white', fontSize: '14px' }}>
                👤 {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Войти
                </button>
              </Link>

              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Регистрация
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu"
          style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {isAuthenticated && user ? (
            <>
              {user.role === 'SELLER' && (
                <Link 
                  to="/seller/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px'
                  }}
                >
                  📊 Панель продавца
                </Link>
              )}
              
              <Link 
                to="/orders" 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px'
                }}
              >
                📦 Мои заказы
              </Link>
              
              <div style={{ 
                padding: '10px', 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '4px'
              }}>
                👤 {user.email}
              </div>
              
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button style={{
                  width: '100%',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Войти
                </button>
              </Link>

              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <button style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Регистрация
                </button>
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
