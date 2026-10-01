'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';

const categoryEmojis: { [key: string]: string } = {
  Electronics: '📱',
  Clothing: '👕',
  Home: '🏠',
  Books: '📚',
  Sports: '⚽',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading products...
      </div>
    );
  }

  return (
    <div>
      <h1>Our Products</h1>

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label>Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
          }}
        >
          <option value="">All Categories</option>
          {Object.keys(categoryEmojis).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="product-card"
            >
              <div className="product-image">
                {categoryEmojis[product.category] || '📦'}
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-description">{product.description}</div>
                <div className="product-price">₹{product.price}</div>
                <div className="product-stock">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
