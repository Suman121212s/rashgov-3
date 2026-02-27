'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserOrders, Order } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Package, Clock, Truck, CircleCheck as CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersContent() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);
        
        // Fetch active orders (not delivered)
        const userOrders = await getUserOrders(user.id, ['pending', 'paid', 'shipped']);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'paid':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment pending';
      case 'paid':
        return 'Payment confirmed, preparing for shipment';
      case 'shipped':
        return 'Order shipped and on the way';
      case 'delivered':
        return 'Order delivered successfully';
      default:
        return 'Unknown status';
    }
  };

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
            Active Orders
          </h1>
          <p className="text-xl text-gray-600">
            Track your current orders and their status
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-playfair font-bold text-gray-600 mb-4">
              No active orders
            </h2>
            <p className="text-gray-500 mb-8">
              You don't have any active orders at the moment
            </p>
            <div className="space-x-4">
              <Link href="/">
                <button className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300">
                  Start Shopping
                </button>
              </Link>
              <Link href="/order-history">
                <button className="border border-forest-green text-forest-green hover:bg-forest-green hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300">
                  View Order History
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-forest-green text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-playfair font-bold mb-1">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-white/80">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{order.total_amount}</div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        <span>{order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Status Description */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-700">{getStatusDescription(order.order_status)}</p>
                  </div>

                  {/* Order Items */}
                  <div>
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

                  {/* Payment Info */}
                  {order.payment_id && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Payment Confirmed</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Payment ID: {order.payment_id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex space-x-4">
            <Link href="/order-history">
              <button className="border border-forest-green text-forest-green hover:bg-forest-green hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
                View Order History
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