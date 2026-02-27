import { notFound } from 'next/navigation';
import { getSectionBySlug, getProductsBySection } from '@/lib/supabaseClient';
import ProductGrid from '@/components/ui/product-grid';

interface SectionPageProps {
  params: {
    slug: string;
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const section = await getSectionBySlug(params.slug);
  
  if (!section) {
    notFound();
  }

  const products = await getProductsBySection(section.id);

  return (
    <main className="min-h-screen bg-warm-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${section.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-forest-green/80 via-forest-green/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            {section.name}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            {section.description}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid 
            products={products}
            title={`${section.name} Collection`}
            description={`Discover our premium selection of ${section.name.toLowerCase()} sourced directly from the Himalayas.`}
          />
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: SectionPageProps) {
  const section = await getSectionBySlug(params.slug);
  
  if (!section) {
    return {
      title: 'Section Not Found',
    };
  }

  return {
    title: `${section.name} - Pansarika`,
    description: section.description,
    openGraph: {
      title: `${section.name} - Pansarika`,
      description: section.description,
      images: [section.image],
    },
  };
}