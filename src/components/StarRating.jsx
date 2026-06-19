import { useState } from 'react';

// Компонент принимает:
// - rating: текущий рейтинг (число от 0 до 5)
// - onRate: функция, вызывается при клике (необязательна)
// - size: размер звёзд в пикселях
function StarRating({ rating = 0, onRate, size = 24, readonly = false }) {
  // Коробка для "наведения" — какая звезда сейчас под курсором
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {/* Рисуем 5 звёзд */}
      {[1, 2, 3, 4, 5].map((star) => {
        // Звезда заполнена, если:
        // - либо под курсором (hoverRating)
        // - либо рейтинг >= номеру звезды
        const isFilled = (hoverRating || rating) >= star;

        return (
          <span
            key={star}
            onClick={() => !readonly && onRate && onRate(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            style={{
              fontSize: `${size}px`,
              cursor: readonly ? 'default' : 'pointer',
              color: isFilled ? '#f39c12' : '#ddd',
              transition: 'color 0.2s',
              userSelect: 'none'
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;