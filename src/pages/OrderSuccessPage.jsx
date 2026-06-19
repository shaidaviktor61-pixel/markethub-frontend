import { useParams, Link } from 'react-router-dom';

function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <div style={{ 
      padding: '50px 20px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '80px',
        marginBottom: '20px'
      }}>
        ✅
      </div>
      
      <h1 style={{ color: '#27ae60', marginBottom: '20px' }}>
        Заказ успешно оформлен!
      </h1>
      
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Номер вашего заказа: <strong>#{orderId}</strong>
      </p>

      <p style={{ fontSize: '16px', color: '#999', marginBottom: '40px' }}>
        Мы свяжемся с вами для подтверждения доставки
      </p>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link 
          to="/"
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          Продолжить покупки
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;