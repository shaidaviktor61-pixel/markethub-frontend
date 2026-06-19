import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        padding: '50px 20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Ваша корзина пуста</h2>
        <p style={{ color: '#666', margin: '20px 0' }}>
          Добавьте товары из каталога
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
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Корзина</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Список товаров */}
        <div>
          {cartItems.map(item => (
            <div 
              key={item.id}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '15px',
                alignItems: 'center'
              }}
            >
              <img 
                src={item.image_url || 'https://via.placeholder.com/100'}
                alt={item.title}
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  ${item.price} за шт.
                </p>
              </div>

              {/* Количество */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: '30px',
                    height: '30px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  +
                </button>
              </div>

              {/* Цена за количество */}
              <div style={{ minWidth: '100px', textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Удалить */}
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#e74c3c',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
                title="Удалить"
              >
                🗑️
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            style={{
              backgroundColor: 'transparent',
              color: '#e74c3c',
              border: '1px solid #e74c3c',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Очистить корзину
          </button>
        </div>

        {/* Итого */}
        <div>
          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ marginTop: 0 }}>Итого</h3>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px' 
            }}>
              <span>Товаров:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              <span>Сумма:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <Link 
              to="/checkout"
              style={{
                display: 'block',
                width: '100%',
                padding: '15px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box'
              }}
            >
              Оформить заказ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;