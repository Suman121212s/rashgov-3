import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pansarika - Pure Himalayan Herbs & Wellness Products',
  description: 'Authentic traditional wellness sourced directly from the Himalayas. Experience the purity of 100% natural herbs, spices, and wellness products.',
  keywords: 'himalayan herbs, organic spices, ayurvedic products, natural wellness, traditional medicine, pure herbs, authentic spices',
  openGraph: {
    title: 'Pansarika - Pure Himalayan Herbs & Wellness Products',
    description: 'Authentic traditional wellness sourced directly from the Himalayas.',
    images: [
      {
        url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
        width: 1200,
        height: 630,
        alt: 'Himalayan herbs and natural wellness products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pansarika - Pure Himalayan Herbs & Wellness Products',
    description: 'Authentic traditional wellness sourced directly from the Himalayas.',
    images: ['https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}