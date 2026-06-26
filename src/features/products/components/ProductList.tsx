import React from 'react';
import { getProducts, type Product } from '../services/productService';

const ProductList: React.FC = () => {
  const products: Product[] = getProducts();

  return (
    <div style={{ width: '100%', maxWidth: '600px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Nama Produk</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Harga</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Stok</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{product.id}</td>
              <td style={{ padding: '8px' }}>{product.name}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
              </td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
