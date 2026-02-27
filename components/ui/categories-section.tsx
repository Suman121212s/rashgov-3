'use client';

import { useEffect, useRef, useState } from 'react';
import { Section } from '@/lib/supabaseClient';
import SectionCard from './section-card';


interface CategoriesSectionProps {
  sections: Section[];
}

export default function CategoriesSection({ sections }: CategoriesSectionProps) {
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

    const items = sectionRef.current?.querySelectorAll('.category-item');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <section ref={sectionRef} className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            Explore Our Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium herbs, spices, and wellness products 
            sourced from the pristine regions of India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              data-index={index}
              className={`category-item group bg-white rounded-2xl overflow-hidden shadow-lg hover-lift image-zoom transform transition-all duration-700 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <SectionCard section={section} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}