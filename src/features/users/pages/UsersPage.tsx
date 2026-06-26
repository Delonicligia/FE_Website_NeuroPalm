import React from 'react';
import UserList from '../components/UserList';

const UsersPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kelola Pengguna</h1>
      <p>Berikut adalah daftar pengguna sistem Website Admin NeuroPalm.</p>
      <UserList />
    </div>
  );
};

export default UsersPage;
