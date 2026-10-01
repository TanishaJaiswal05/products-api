'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/lib/types';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading order details...
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your order has been confirmed.</p>

      {order && (
        <div className="order-details">
          <div className="order-details-row">
            <span>Order ID:</span>
            <strong>{order._id}</strong>
          </div>
          <div className="order-details-row">
            <span>Total Amount:</span>
            <strong>₹{order.totalAmount.toFixed(2)}</strong>
          </div>
          <div className="order-details-row">
            <span>Status:</span>
            <strong style={{ color: '#27ae60' }}>PAID</strong>
          </div>
          <div className="order-details-row">
            <span>Customer Name:</span>
            <strong>{order.customerName}</strong>
          </div>
          <div className="order-details-row">
            <span>Email:</span>
            <strong>{order.customerEmail}</strong>
          </div>
          <div className="order-details-row">
            <span>Shipping Address:</span>
            <strong>{order.shippingAddress}</strong>
          </div>
          <div className="order-details-row">
            <span>Items:</span>
            <strong>{order.items.length} product(s)</strong>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>
          A confirmation email has been sent to {order?.customerEmail}
        </p>
        <Link href="/products" className="btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
