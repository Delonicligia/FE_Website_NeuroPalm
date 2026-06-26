import React from 'react';
import ProductList from '../components/ProductList';

const ProductsPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kelola Produk</h1>
      <p>Berikut adalah daftar produk yang tersedia di sistem NeuroPalm.</p>
      <ProductList />
    </div>
  );
};

export default ProductsPage;
