'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BrandStory() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-6">
              <span className="inline-block bg-soft-gold/20 text-soft-gold px-4 py-2 rounded-full text-sm font-medium">
                Our Mission
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-6">
              Preserving Ancient Wisdom for Modern Wellness
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Pansarika was born from a deep respect for traditional healing wisdom and 
              a commitment to bringing the purest Himalayan herbs to your doorstep. 
              Our journey began in the remote villages of Uttarakhand, where we discovered 
              the incredible potency of herbs grown at high altitudes.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Working directly with local farmers and traditional healers, we ensure 
              every product maintains its authentic properties while meeting modern 
              quality standards. From the pristine valleys of Kashmir to the ancient 
              forests of Madhya Pradesh, we source only the finest ingredients.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-forest-green font-playfair">5000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-forest-green font-playfair">15+</div>
                <div className="text-sm text-gray-600">Source Regions</div>
              </div>
            </div>
            
            <Button 
              className="bg-forest-green hover:bg-forest-green/90 text-white rounded-full px-8 py-4"
            >
              Read Our Full Story
            </Button>
          </div>

          {/* Image */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/8412834/pexels-photo-8412834.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Traditional herb farming in the Himalayas"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm font-medium text-forest-green mb-1">
                    "Quality that speaks for itself"
                  </p>
                  <p className="text-xs text-gray-600">
                    Traditional farming methods passed down through generations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}