'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserProfile, getOrderStats, getUserOrders, UserProfile, Order } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Package, Clock, CircleCheck as CheckCircle, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);

        // Fetch user profile
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);

        // Fetch order stats
        const orderStats = await getOrderStats(user.id);
        setStats(orderStats);

        // Fetch recent orders
        const orders = await getUserOrders(user.id);
        setRecentOrders(orders.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-forest-green"></div>
      </div>
    );
  }

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

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            Welcome back, {profile?.full_name || user?.user_metadata?.full_name || 'Friend'}!
          </h1>
          <p className="text-xl text-gray-600">
            Here's an overview of your wellness journey with Pansarika.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift">
            <div className="flex items-center space-x-4">
              <div className="bg-forest-green/10 p-4 rounded-full">
                <Package className="h-8 w-8 text-forest-green" />
              </div>
              <div>
                <div className="text-3xl font-playfair font-bold text-forest-green">
                  {stats.total}
                </div>
                <div className="text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift">
            <div className="flex items-center space-x-4">
              <div className="bg-soft-gold/10 p-4 rounded-full">
                <Clock className="h-8 w-8 text-soft-gold" />
              </div>
              <div>
                <div className="text-3xl font-playfair font-bold text-forest-green">
                  {stats.pending}
                </div>
                <div className="text-gray-600">Pending Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-playfair font-bold text-forest-green">
                  {stats.delivered}
                </div>
                <div className="text-gray-600">Delivered Orders</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Profile Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-forest-green/10 p-3 rounded-full">
                <UserIcon className="h-6 w-6 text-forest-green" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-forest-green">
                Profile Summary
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-forest-green font-medium">
                  {profile?.full_name || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-forest-green font-medium">
                  {profile?.email || user?.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-forest-green font-medium">
                  {profile?.phone || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-forest-green font-medium">
                  {profile?.address ? 
                    `${profile.address}, ${profile.city}, ${profile.state} - ${profile.pincode}` : 
                    'Not provided'
                  }
                </p>
              </div>
            </div>

            <Link href="/profile">
              <button className="mt-6 w-full bg-forest-green hover:bg-forest-green/90 text-white py-3 rounded-xl font-semibold transition-colors duration-300">
                Update Profile
              </button>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-playfair font-bold text-forest-green">
                Recent Orders
              </h2>
              <Link href="/orders" className="text-soft-gold hover:text-soft-gold/80 font-medium">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders yet</p>
                <Link href="/shop">
                  <button className="mt-4 bg-forest-green hover:bg-forest-green/90 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-300">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-forest-green">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {order.order_items?.length || 0} items
                      </span>
                      <span className="font-bold text-forest-green">
                        ₹{order.total_amount}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}