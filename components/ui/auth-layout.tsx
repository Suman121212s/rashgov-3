'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroFeatures?: string[];
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  heroImage,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroFeatures = []
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-warm-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-forest-green hover:text-soft-gold mb-8 transition-colors duration-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="text-2xl font-playfair font-bold text-forest-green">Pansarika</div>
              <div className="text-xs text-soft-gold font-medium tracking-wider">
                PURE • TRADITIONAL
              </div>
            </div>
            <h1 className="text-3xl font-playfair font-bold text-forest-green mb-2">
              {title}
            </h1>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src={heroImage}
          alt={heroTitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green/80 via-forest-green/60 to-transparent" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
          <div className="max-w-md">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              {heroTitle}
            </h2>
            <p className="text-xl mb-2 text-soft-gold">
              {heroSubtitle}
            </p>
            <p className="text-white/80 leading-relaxed mb-8">
              {heroDescription}
            </p>
            
            {heroFeatures.length > 0 && (
              <div className="grid grid-cols-1 gap-4 text-left">
                {heroFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-soft-gold rounded-full flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}