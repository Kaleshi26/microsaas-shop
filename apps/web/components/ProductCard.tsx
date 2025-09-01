export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white border rounded p-4">
      <img src={product.imageUrl} alt={product.name} className="rounded mb-2" />
      <div className="font-semibold">{product.name}</div>
      <div className="text-gray-600 text-sm">{product.description}</div>
      <div className="mt-2">${(product.priceCents / 100).toFixed(2)}</div>
    </div>
  );
}