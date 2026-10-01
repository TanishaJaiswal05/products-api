'use client';

import React from 'react';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ShopHub - eCommerce Platform</title>
        <meta name="description" content="Modern eCommerce platform" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <Link href="/" className="logo">
              🛍️ ShopHub
            </Link>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/cart">Cart</Link>
            </div>
          </div>
        </nav>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>&copy; 2026 ShopHub. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
