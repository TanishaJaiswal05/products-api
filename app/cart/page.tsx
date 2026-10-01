'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CartItem } from '@/lib/types';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          <p>Start shopping to add items to your cart.</p>
          <Link href="/products" className="btn" style={{ marginTop: '1rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-image">📦</div>
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <div className="cart-item-price">₹{item.price}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                −
              </button>
              <input
                type="number"
                value={item.quantity}
                readOnly
                style={{
                  width: '50px',
                  textAlign: 'center',
                  margin: '0 0.5rem',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                +
              </button>
            </div>
            <div className="cart-item-price">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal:</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="cart-summary-total">
          <span>Total:</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link href="/products" className="btn btn-outline">
          Continue Shopping
        </Link>
        <button onClick={clearCart} className="btn btn-outline">
          Clear Cart
        </button>
        <Link href="/checkout" className="btn" style={{ flex: 1 }}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
