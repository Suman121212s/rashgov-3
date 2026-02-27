import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/supabaseClient';
import CheckoutButton from '@/components/ui/checkout-button';
import ProductGrid from '@/components/ui/product-grid';
import { Star, Shield, Truck, Award } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.section_id, product.id);

  return (
    <main className="min-h-screen bg-warm-white">
      {/* Product Details Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Image */}
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block bg-soft-gold/20 text-soft-gold px-4 py-2 rounded-full text-sm font-medium">
                  {product.section?.name}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
                {product.name}
              </h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {product.short_description}
              </p>

              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.9/5 from 128 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-forest-green mb-8">
                ₹{product.price}
              </div>

              <div className="space-y-4 mb-8">
                <CheckoutButton
                  productId={product.id}
                  productName={product.name}
                  price={product.price}
                  className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-4 text-lg font-semibold rounded-xl"
                  size="lg"
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>100% Pure & Natural</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Lab Tested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-forest-green mb-8 text-center">
            The Story Behind {product.name}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p>{product.story}</p>
          </div>
        </div>
      </section>

      {/* Full Description Section */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-forest-green mb-8 text-center">
            Product Details
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p>{product.full_description}</p>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      {Object.keys(product.technical_details).length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-forest-green mb-8 text-center">
              Technical Specifications
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.technical_details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium text-forest-green capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-600">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-warm-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGrid 
              products={relatedProducts}
              title="You Might Also Like"
              description="Discover more premium products from our collection"
            />
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Pansarika`,
    description: product.short_description,
    openGraph: {
      title: `${product.name} - Pansarika`,
      description: product.short_description,
      images: [product.image],
    },
  };
}