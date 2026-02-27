'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserOrders, Order } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Package, CircleCheck as CheckCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function OrderHistoryContent() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);
        
        // Fetch delivered orders only
        const userOrders = await getUserOrders(user.id, ['delivered']);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            Order History
          </h1>
          <p className="text-xl text-gray-600">
            View your completed orders and reorder your favorites
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-playfair font-bold text-gray-600 mb-4">
              No order history
            </h2>
            <p className="text-gray-500 mb-8">
              You haven't completed any orders yet
            </p>
            <div className="space-x-4">
              <Link href="/">
                <button className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300">
                  Start Shopping
                </button>
              </Link>
              <Link href="/orders">
                <button className="border border-forest-green text-forest-green hover:bg-forest-green hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300">
                  View Active Orders
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-green-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-playfair font-bold mb-1">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-white/80">
                        Delivered on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{order.total_amount}</div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-forest-green mb-4">
                      Items ({order.order_items?.length || 0})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-forest-green text-sm">
                              {item.product?.name}
                            </h5>
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.price}
                            </div>
                            <div className="text-sm font-semibold text-forest-green">
                              ₹{item.quantity * item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Payment ID: {order.payment_id}
                    </div>
                    <button className="inline-flex items-center space-x-2 bg-forest-green hover:bg-forest-green/90 text-white px-6 py-2 rounded-xl font-semibold transition-colors duration-300">
                      <RotateCcw className="h-4 w-4" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex space-x-4">
            <Link href="/orders">
              <button className="border border-forest-green text-forest-green hover:bg-forest-green hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
                View Active Orders
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-soft-gold hover:bg-soft-gold/90 text-forest-green px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
                Need Help?
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}