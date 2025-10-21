// This file is part of the Next.js Commerce project.
'use client';
import useSWR from 'swr';
import ProductCard from '../../components/ProductCard';

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Products() {
  const { data } = useSWR(`${API}/products`, fetcher);
  const products = data || [];
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}