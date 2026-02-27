'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleCheck as CheckCircle, ArrowRight, Chrome as Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState({
    paymentId: '',
    orderId: '',
  });

  useEffect(() => {
    setPaymentDetails({
      paymentId: searchParams.get('payment_id') || '',
      orderId: searchParams.get('order_id') || '',
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-playfair font-bold text-forest-green mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {/* Payment Details */}
        {paymentDetails.paymentId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-semibold text-forest-green mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-xs">{paymentDetails.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-xs">{paymentDetails.orderId}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-soft-gold/10 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-forest-green mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• Your order will be processed within 24 hours</li>
            <li>• Expect delivery within 3-5 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-3 rounded-xl font-semibold">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/orders">
            <Button variant="outline" className="w-full border-forest-green text-forest-green hover:bg-forest-green hover:text-white py-3 rounded-xl font-semibold">
              View Orders
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact us at{' '}
          <a href="mailto:support@pansarika.com" className="text-forest-green hover:underline">
            support@pansarika.com
          </a>
        </p>
      </div>
    </div>
  );
}