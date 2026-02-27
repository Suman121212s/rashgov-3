'use client';

import { useEffect, useRef, useState } from 'react';
import { Leaf, Shield, Heart, Award } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Pure & Natural',
    description: 'No chemicals, additives, or artificial preservatives. Just pure, natural ingredients sourced directly from nature.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Shield,
    title: 'Ethically Sourced',
    description: 'We work directly with farmers, ensuring fair trade practices and sustainable harvesting methods.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Heart,
    title: 'Traditional Knowledge',
    description: 'Our products are based on centuries-old Ayurvedic wisdom, passed down through generations of healers.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Each batch is carefully tested for purity and potency, meeting the highest quality standards.',
    color: 'bg-yellow-100 text-yellow-600'
  }
];

export default function WhyChoose() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.feature-item');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            Why Choose Pansarika?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our commitment to purity, tradition, and sustainability makes us the trusted 
            choice for authentic Himalayan wellness products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`feature-item group text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-500 transform ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-playfair font-semibold text-forest-green mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-forest-green rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-playfair font-bold text-soft-gold mb-2">
                99.9%
              </div>
              <p className="text-lg opacity-90">Purity Guaranteed</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-playfair font-bold text-soft-gold mb-2">
                48h
              </div>
              <p className="text-lg opacity-90">Fresh Delivery</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-playfair font-bold text-soft-gold mb-2">
                100%
              </div>
              <p className="text-lg opacity-90">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}