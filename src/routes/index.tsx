import React, { useState, useEffect } from 'react';
import LoginPage from '../features/auth/pages/LoginPage';
import UsersPage from '../features/users/pages/UsersPage';
import ProductsPage from '../features/products/pages/ProductsPage';
import { useAuth } from '../shared/hooks/useAuth';

export type Page = 'login' | 'users' | 'products';

const Router: React.FC = () => {
  const { isAuth, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('users');

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuth) {
      setCurrentPage('login');
    } else if (currentPage === 'login') {
      setCurrentPage('users');
    }
  }, [isAuth, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'users':
        return <UsersPage />;
      case 'products':
        return <ProductsPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <div>
      {isAuth && (
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#333',
          color: '#fff',
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>NeuroPalm Admin</div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage('users')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'users' ? '#0070f3' : '#fff',
                fontWeight: currentPage === 'users' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              Pengguna
            </button>
            <button
              onClick={() => setCurrentPage('products')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'products' ? '#0070f3' : '#fff',
                fontWeight: currentPage === 'products' ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              Produk
            </button>
            <button
              onClick={logout}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#ff4d4d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </nav>
      )}
      <main style={{ minHeight: '80vh' }}>
        {renderPage()}
      </main>
    </div>
  );
};

export default Router;
