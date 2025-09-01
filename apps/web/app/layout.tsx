import './globals.css';
import { ReactNode } from 'react';
import Nav from '../components/Nav';

export const metadata = { title: 'MicroSaaS Shop', description: 'Next.js + NestJS shop' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Nav />
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}