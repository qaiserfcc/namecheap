import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chiltan Pure - Premium Organic Products',
  description: 'Shop premium organic products at discounted prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
