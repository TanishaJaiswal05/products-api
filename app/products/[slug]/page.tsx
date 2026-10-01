'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';

const categoryEmojis: { [key: string]: string } = {
  Electronics: '📱',
  Clothing: '👕',
  Home: '🏠',
  Books: '📚',
  Sports: '⚽',
};

export default function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.slug}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        {categoryEmojis[product.category] || '📦'}
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <div className="price">₹{product.price}</div>
        <p>{product.description}</p>
        <p style={{ color: '#999', marginBottom: '1rem' }}>
          Category: <strong>{product.category}</strong>
        </p>
        <p style={{ color: '#999', marginBottom: '2rem' }}>
          {product.stock > 0
            ? `${product.stock} items in stock`
            : 'Out of stock'}
        </p>

        <div className="quantity-selector">
          <label>Quantity:</label>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            −
          </button>
          <input type="number" value={quantity} readOnly />
          <button
            onClick={() =>
              setQuantity(Math.min(product.stock, quantity + 1))
            }
          >
            +
          </button>
        </div>

        <button
          className="btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
