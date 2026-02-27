'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/contact', label: 'Contact' },
  ];

  const userLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/orders', label: 'Orders' },
    { href: '/cart', label: 'Cart' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-playfair font-bold text-forest-green">
              Pansarika
            </div>
            <div className="text-xs text-soft-gold font-medium tracking-wider">
              PURE • TRADITIONAL
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-forest-green hover:text-soft-gold transition-colors duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
            {user && userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-forest-green hover:text-soft-gold transition-colors duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-forest-green hover:text-soft-gold">
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-forest-green">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost" 
                  size="sm" 
                  className="text-forest-green hover:text-soft-gold"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-forest-green hover:text-soft-gold">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="text-forest-green hover:text-soft-gold relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-soft-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>
            </Link>
            <Button className="bg-forest-green hover:bg-forest-green/90 text-white rounded-full px-6">
              Shop Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-forest-green"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-forest-green hover:text-soft-gold transition-colors duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && userLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-forest-green hover:text-soft-gold transition-colors duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-3 py-2">
                {user ? (
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost" 
                    size="sm" 
                    className="text-forest-green"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-forest-green">
                      <User className="h-5 w-5 mr-2" />
                      Account
                    </Button>
                  </Link>
                )}
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="text-forest-green">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}