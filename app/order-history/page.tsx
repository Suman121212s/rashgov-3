import { Suspense } from 'react';
import AuthGuard from '@/components/ui/auth-guard';
import OrderHistoryContent from '@/components/ui/order-history-content';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

export default function OrderHistoryPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-green"></div>
            </div>
          }>
            <OrderHistoryContent />
          </Suspense>
        </div>
        <Footer />
      </main>
    </AuthGuard>
  );
}