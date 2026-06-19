import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

// ✅ Берем URL из переменной окружения
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function HomePage() {
  // Коробка для всех товаров
  const [allProducts, setAllProducts] = useState([]);
  
  // Коробка для всех категорий (для отображения названий)
  const [categories, setCategories] = useState([]);
  
  // Коробка для состояния загрузки
  const [loading, setLoading] = useState(true);

  // Фильтр по цене
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Сортировка
  const [sortBy, setSortBy] = useState('');

  // Получаем глобальные фильтры из контекста
  const { searchText, selectedCategory } = useSearch();

  // Загружаем товары И категории при первом рендере
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      // ✅ Исправлено: используем API_URL
      const response = await axios.get(`${API_URL}/api/products`);
      setAllProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // ✅ Исправлено: используем API_URL
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  // Фильтруем и сортируем товары
  const getFilteredProducts = () => {
    // ШАГ 1: Фильтрация
    let filtered = allProducts.filter(product => {
      // Критерий 1: Поиск по названию
      const matchesSearch = !searchText.trim() || 
        product.title.toLowerCase().includes(searchText.toLowerCase());
      
      // Критерий 2: Фильтр по категории
      const matchesCategory = !selectedCategory || 
        String(product.category_id) === selectedCategory;
      
      // Критерий 3: Минимальная цена
      const matchesMinPrice = !minPrice || 
        parseFloat(product.price) >= parseFloat(minPrice);
      
      // Критерий 4: Максимальная цена
      const matchesMaxPrice = !maxPrice || 
        parseFloat(product.price) <= parseFloat(maxPrice);
      
      // Все критерии должны быть true
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    // ШАГ 2: Сортировка
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'price_desc':
            return parseFloat(b.price) - parseFloat(a.price);
          case 'name_asc':
            return a.title.localeCompare(b.title);
          case 'name_desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Сбросить все фильтры
  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MarketHub - Маркетплейс</h1>
      
      {/* Панель фильтров */}
      <div style={{
        padding: '20px',
        backgroundColor: '#363232',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Фильтры</h3>
        
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}>
          {/* Цена от */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Цена от ($)
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                width: '100px'
              }}
            />
          </div>

          {/* Цена до */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Цена до ($)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="9999"
              min="0"
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                width: '100px'
              }}
            />
          </div>

          {/* Сортировка */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Сортировка
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">Без сортировки</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="name_asc">Название: А-Я</option>
              <option value="name_desc">Название: Я-А</option>
            </select>
          </div>

          {/* Кнопка сброса */}
          <button
            onClick={resetFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Сбросить
          </button>
        </div>
      </div>
      
      {/* Информация о фильтрах */}
      {(searchText || selectedCategory || minPrice || maxPrice || sortBy) && (
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Найдено товаров: {filteredProducts.length}
          {searchText && <> по запросу "<strong>{searchText}</strong>"</>}
          {selectedCategory && <> в категории "<strong>
            {categories.find(c => String(c.id) === selectedCategory)?.name}
          </strong>"</>}
          {(minPrice || maxPrice) && <> от <strong>${minPrice || '0'}</strong> до <strong>${maxPrice || '∞'}</strong></>}
        </p>
      )}
      
      {/* Список товаров */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {filteredProducts.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            Товары не найдены
          </p>
        ) : (
          filteredProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src={product.image_url || 'https://via.placeholder.com/200'} 
                  alt={product.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <h3 style={{ marginTop: '10px', fontSize: '16px' }}>{product.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                  {product.description}
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>
                  ${product.price}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  Категория: {product.category?.name || 'Не указана'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
