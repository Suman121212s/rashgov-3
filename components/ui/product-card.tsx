'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product, addToCart, supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      await addToCart(user.id, product.id, 1);
      // You could add a toast notification here
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover-lift image-zoom">
      {/* Product Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-w-16 aspect-h-12 overflow-hidden cursor-pointer">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300"
        >
          <Heart 
            className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors duration-300`}
          />
        </button>

        {/* Quick Add to Cart - Visible on Hover */}
        <div className="absolute inset-0 bg-forest-green/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-soft-gold hover:bg-soft-gold/90 text-forest-green font-semibold rounded-full transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAddingToCart ? 'Adding...' : 'Quick Add'}
          </Button>
        </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">

        <Link href={`/product/${product.slug}`}>
          <h3 className="text-lg font-playfair font-semibold text-forest-green mb-2 line-clamp-2 hover:text-soft-gold transition-colors duration-300 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.short_description}
        </p>
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">(4.9)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-forest-green">₹{product.price}</span>
          </div>
          
          <Link href={`/product/${product.slug}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white rounded-full"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}