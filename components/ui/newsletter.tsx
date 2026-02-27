'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-forest-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="h-16 w-16 text-soft-gold mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Join Our Wellness Community
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Get exclusive access to ancient wellness wisdom, seasonal recipes, 
              and special offers on our premium Himalayan products.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-full px-6 py-4"
                />
                <Button 
                  type="submit"
                  className="bg-soft-gold hover:bg-soft-gold/90 text-forest-green font-semibold rounded-full px-8 py-4 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-white/60 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-soft-gold text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-playfair font-semibold text-white mb-2">
                Welcome to the Family!
              </h3>
              <p className="text-white/80">
                Thank you for joining our wellness community. Check your inbox for a special welcome offer.
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            <div>
              <div className="text-soft-gold text-2xl mb-2">🌿</div>
              <h3 className="font-semibold text-white mb-2">Wellness Tips</h3>
              <p className="text-white/70 text-sm">
                Weekly insights on natural healing and traditional remedies
              </p>
            </div>
            <div>
              <div className="text-soft-gold text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-white mb-2">Exclusive Offers</h3>
              <p className="text-white/70 text-sm">
                Special discounts and early access to new products
              </p>
            </div>
            <div>
              <div className="text-soft-gold text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-white mb-2">Ancient Recipes</h3>
              <p className="text-white/70 text-sm">
                Traditional formulations and seasonal wellness guides
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}