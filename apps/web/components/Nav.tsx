export default function Nav() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <a href="/" className="font-bold">MicroSaaS Shop</a>
        <div className="space-x-4">
          <a href="/products">Products</a>
          <a href="/checkout">Checkout</a>
          <a href="/profile">Profile</a>
          <a href="/api/auth/login">Login</a>
          <a href="/api/auth/logout">Logout</a>
        </div>
      </div>
    </nav>
  );
}