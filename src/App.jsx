import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';  // ← ДОБАВЬ
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AddProductPage from './pages/AddProductPage';
import SellerDashboard from './pages/SellerDashboard';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>  {/* ← ДОБАВЬ */}
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products/add" element={<AddProductPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>  {/* ← ДОБАВЬ */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;