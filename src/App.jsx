import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { CategoriaProvider } from './context/CategoriaContext';
import Home          from './pages/Home';
import Category      from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Account       from './pages/Account';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Search        from './pages/Search';
import Admin         from './pages/Admin';
import Nosotros      from './pages/Nosotros';
import Contacto      from './pages/Contacto';
import Marca         from './pages/Marca';
import Todos         from './pages/Todos';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CategoriaProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/*" element={
                  <>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/"                element={<Home />} />
                        <Route path="/categoria/:slug" element={<Category />} />
                        <Route path="/producto/:id"    element={<ProductDetail />} />
                        <Route path="/carrito"         element={<Cart />} />
                        <Route path="/cuenta"          element={<Account />} />
                        <Route path="/login"           element={<Login />} />
                        <Route path="/registro"        element={<Register />} />
                        <Route path="/buscar"          element={<Search />} />
                      <Route path="/nosotros"        element={<Nosotros />} />
                      <Route path="/contacto"        element={<Contacto />} />
                      <Route path="/marca/:slug"     element={<Marca />} />
                      <Route path="/todos"           element={<Todos />} />
                        <Route path="*"               element={<Home />} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </CategoriaProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
