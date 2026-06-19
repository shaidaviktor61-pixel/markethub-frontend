import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReviewsSection from '../components/ReviewsSection';

// ✅ Берем URL из переменной окружения
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ProductDetail() {
  const { id } = useParams(); // Получаем ID из URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // ✅ Исправлено: используем API_URL
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка...</div>;
  }

  if (!product) {
    return <div style={{ padding: '20px' }}>Товар не найден</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#3498db', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Назад к списку товаров
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
        {/* Левая колонка - картинка */}
        <div>
          <img 
            src={product.image_url || 'https://via.placeholder.com/500'} 
            alt={product.title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
        
        {/* Правая колонка - информация */}
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{product.title}</h1>
          
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>
            Категория: {product.category?.name || 'Не указана'} | 
            Продавец: {product.seller?.email || 'Неизвестно'}
          </p>
          
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px' }}>
            ${product.price}
          </p>
          
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
            {product.description}
          </p>
          
          <p style={{ fontSize: '14px', color: product.stock_quantity > 0 ? '#27ae60' : '#e74c3c', marginBottom: '20px' }}>
            {product.stock_quantity > 0 
              ? `В наличии: ${product.stock_quantity} шт.` 
              : 'Нет в наличии'}
          </p>
          
          <button 
            disabled={product.stock_quantity === 0}
            onClick={() => addToCart(product)}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: product.stock_quantity > 0 ? '#27ae60' : '#bdc3c7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: product.stock_quantity > 0 ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {product.stock_quantity > 0 ? '🛒 Добавить в корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>
      {/* Секция отзывов */}
      <ReviewsSection productId={parseInt(id)} />
    </div>
  );
}

export default ProductDetail;
