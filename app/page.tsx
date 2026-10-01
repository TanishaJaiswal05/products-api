'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Welcome to ShopHub</h1>
        <p>Discover amazing products at unbeatable prices</p>
        <Link href="/products" className="cta-button">
          Start Shopping
        </Link>
      </section>

      <section>
        <h2>Featured Categories</h2>
        <div className="products-grid">
          {[
            { name: 'Electronics', emoji: '📱' },
            { name: 'Clothing', emoji: '👕' },
            { name: 'Home', emoji: '🏠' },
            { name: 'Books', emoji: '📚' },
            { name: 'Sports', emoji: '⚽' },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${category.name}`}
              className="product-card"
            >
              <div className="product-image">{category.emoji}</div>
              <div className="product-info">
                <div className="product-name">{category.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
