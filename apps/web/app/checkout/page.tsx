'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const buy = async () => {
    setLoading(true);
    const res = await fetch(`${API}/orders/checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: 'Pro Hoodie' },
              unit_amount: 5900
            },
            quantity: 1
          }
        ]
      })
    });
    const { url } = await res.json();
    window.location.href = url;
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <button onClick={buy} disabled={loading} className="px-4 py-2 bg-black text-white rounded">
        {loading ? 'Redirecting...' : 'Buy Hoodie ($59)'}
      </button>
    </div>
  );
}