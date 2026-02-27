import { Suspense } from 'react';
import ContactContent from '@/components/ui/contact-content';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-green"></div>
          </div>
        }>
          <ContactContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}