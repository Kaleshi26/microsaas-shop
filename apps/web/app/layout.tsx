// layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Nav from '../components/Nav';

export const metadata = { 
  title: 'MicroSaaS Shop', 
  description: 'Modern e-commerce platform built with Next.js and NestJS',
  keywords: 'e-commerce, shop, products, nextjs, nestjs',
  authors: [{ name: 'MicroSaaS Team' }],
}; 

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Auth0Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            // ...
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}