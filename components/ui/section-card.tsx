'use client';

import Link from 'next/link';
import { Section } from '@/lib/supabaseClient';

interface SectionCardProps {
  section: Section;
  index?: number;
}

export default function SectionCard({ section, index = 0 }: SectionCardProps) {
  return (
    <Link href={`/section/${section.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover-lift image-zoom transform transition-all duration-700">
        <div className="aspect-w-16 aspect-h-12 overflow-hidden">
          <img
            src={section.image}
            alt={section.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-green/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-playfair font-semibold mb-2">
              {section.name}
            </h3>
            <p className="text-sm opacity-90">
              {section.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}