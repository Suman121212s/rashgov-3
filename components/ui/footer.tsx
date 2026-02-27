import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-playfair font-bold">Pansarika</div>
              <div className="text-xs text-soft-gold font-medium tracking-wider">
                PURE • TRADITIONAL
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Bringing the purity of the Himalayas to your doorstep with authentic 
              herbs, spices, and traditional wellness products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-soft-gold hover:text-forest-green transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-soft-gold hover:text-forest-green transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-soft-gold hover:text-forest-green transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-soft-gold hover:text-forest-green transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-playfair font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Story', href: '/story' },
                { label: 'Shop', href: '/shop' },
                { label: 'Contact', href: '/contact' },
                { label: 'Dashboard', href: '/dashboard' }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/70 hover:text-soft-gold transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-playfair font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Himalayan Herbs', 'Aromatic Spices', 'Wellness Teas', 'Essential Oils', 'Natural Salts'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/70 hover:text-soft-gold transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-playfair font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-soft-gold mt-1 flex-shrink-0" />
                <div className="text-white/70">
                  <p>123 Wellness Street,</p>
                  <p>Dehradun, Uttarakhand 248001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-soft-gold flex-shrink-0" />
                <span className="text-white/70">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-soft-gold flex-shrink-0" />
                <span className="text-white/70">hello@pansarika.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © {currentYear} Pansarika. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-white/60 hover:text-soft-gold transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/60 hover:text-soft-gold transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-white/60 hover:text-soft-gold transition-colors duration-300">
                Contact Us
              </Link>
              <Link href="#" className="text-white/60 hover:text-soft-gold transition-colors duration-300">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}