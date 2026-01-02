import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NameCheap - Premium Deals on Quality Products',
  description: 'Shop premium products at unbeatable prices with NameCheap - Your trusted e-commerce platform',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
