import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem',
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-color, #333)' }}>Masuk ke Website Admin</h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
