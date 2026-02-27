'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCartItems, updateCartItemQuantity, removeFromCart, createOrder, clearCart, CartItem } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartContent() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);
        const items = await getCartItems(user.id);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      await updateCartItemQuantity(itemId, newQuantity);
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await removeFromCart(itemId);
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    setCheckingOut(true);
    try {
      const totalAmount = calculateTotal();
      
      // Create order
      const order = await createOrder(user.id, totalAmount, cartItems);
      if (!order) {
        throw new Error('Failed to create order');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Create Razorpay order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Convert to paise
          currency: 'INR',
          productId: order.id,
          productName: `Order #${order.id.slice(0, 8)}`,
        }),
      });

      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Pansarika',
        description: `Order #${order.id.slice(0, 8)}`,
        image: '/logo.png',
        order_id: orderData.id,
        prefill: {
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          contact: user?.user_metadata?.phone || '',
        },
        theme: {
          color: '#1F3D2B',
        },
        handler: async function (response: any) {
          // Payment successful - update order and clear cart
          try {
            // Update order with payment details
            await supabase
              .from('orders')
              .update({
                payment_id: response.razorpay_payment_id,
                order_status: 'paid'
              })
              .eq('id', order.id);

            // Clear cart
            await clearCart(user.id);

            // Redirect to success page
            router.push(`/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`);
          } catch (error) {
            console.error('Error updating order:', error);
            alert('Payment successful but there was an error updating your order. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setCheckingOut(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate checkout. Please try again.');
      setCheckingOut(false);
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
            Shopping Cart
          </h1>
          <p className="text-xl text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-playfair font-bold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Discover our premium collection of Himalayan wellness products
            </p>
            <Link href="/">
              <Button className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-3 rounded-xl font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-playfair font-bold text-forest-green">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-forest-green mb-1">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product?.short_description}
                          </p>
                          <div className="text-lg font-bold text-forest-green">
                            ₹{item.product?.price}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-playfair font-bold text-forest-green mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-forest-green">Total</span>
                      <span className="text-lg font-bold text-forest-green">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={checkingOut || cartItems.length === 0}
                    className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-3 rounded-xl font-semibold"
                  >
                    {checkingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      `Checkout - ₹${calculateTotal()}`
                    )}
                  </Button>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full border-forest-green text-forest-green hover:bg-forest-green hover:text-white py-3 rounded-xl font-semibold"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}