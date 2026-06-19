import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

function ReviewsSection({ productId }) {
  const { token, isAuthenticated, user } = useAuth();
  
  // Коробки для данных
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Форма отзыва
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Проверяем, оставлял ли пользователь уже отзыв
  const [hasReviewed, setHasReviewed] = useState(false);

  // Загружаем отзывы при монтировании
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // При загрузке отзывов проверяем, есть ли отзыв текущего пользователя
  useEffect(() => {
    if (user && reviews.length > 0) {
      const userReview = reviews.find(r => r.user_id === user.id);
      setHasReviewed(!!userReview);
    } else {
      setHasReviewed(false);
    }
  }, [reviews, user]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/reviews/product/${productId}`
      );
      setReviews(response.data.reviews);
      setAverageRating(parseFloat(response.data.averageRating));
      setTotalReviews(response.data.totalReviews);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Поставьте оценку');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        'http://localhost:3000/api/reviews',
        {
          product_id: productId,
          rating,
          comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Спасибо за отзыв!');
      setRating(0);
      setComment('');
      setHasReviewed(true);
      
      // Перезагружаем отзывы
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка отправки отзыва');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка отзывов...</div>;
  }

  return (
    <div style={{
      marginTop: '40px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      
    }}>
      <h2 style={{ marginTop: 0 }}>Отзывы покупателей</h2>

      {/* Средний рейтинг */}
      {totalReviews > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f39c12' }}>
            {averageRating}
          </div>
          <div>
            <StarRating rating={averageRating} readonly size={20} />
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
              На основе {totalReviews} {totalReviews === 1 ? 'отзыва' : 'отзывов'}
            </p>
          </div>
        </div>
      )}

      {/* Форма отзыва (только для авторизованных, которые ещё не оставляли отзыв) */}
      {isAuthenticated && !hasReviewed && (
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0 }}>Оставить отзыв</h3>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Ваша оценка:
              </label>
              <StarRating rating={rating} onRate={setRating} size={32} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Комментарий (необязательно):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Расскажите о вашем опыте..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || rating === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: submitting || rating === 0 ? '#bdc3c7' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting || rating === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {submitting ? 'Отправка...' : 'Отправить отзыв'}
            </button>
          </form>
        </div>
      )}

      {/* Сообщение, если уже оставлял отзыв */}
      {isAuthenticated && hasReviewed && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ✓ Вы уже оставили отзыв на этот товар
        </div>
      )}

      {/* Сообщение для неавторизованных */}
      {!isAuthenticated && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <a href="/login" style={{ color: '#856404', fontWeight: 'bold' }}>
            Войдите
          </a>, чтобы оставить отзыв
        </div>
      )}

      {/* Список отзывов */}
      {reviews.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
          Пока нет отзывов. Будьте первым!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reviews.map(review => (
            <div 
              key={review.id}
              style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div>
                  <strong>{review.user.email}</strong>
                  <div style={{ marginTop: '5px' }}>
                    <StarRating rating={review.rating} readonly size={16} />
                  </div>
                </div>
                <span style={{ color: '#999', fontSize: '12px' }}>
                  {new Date(review.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              
              {review.comment && (
                <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;