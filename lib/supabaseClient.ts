import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
);

// Types
export interface Section {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  short_description: string;
  full_description: string;
  story: string;
  technical_details: Record<string, any>;
  section_id: string;
  created_at: string;
  section?: Section;
}

// User Profile Types
export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  created_at: string;
}

// Cart Types
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  payment_id?: string;
  order_status: 'pending' | 'paid' | 'shipped' | 'delivered';
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

// Contact Message Type
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

// Data fetching functions
export async function getSections(): Promise<Section[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sections:', error);
    return [];
  }

  return data || [];
}

export async function getSectionBySlug(slug: string): Promise<Section | null> {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching section:', error);
    return null;
  }

  return data;
}

export async function getProductsBySection(sectionId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('section_id', sectionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      section:sections(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getRelatedProducts(sectionId: string, currentProductId: string, limit: number = 3): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('section_id', sectionId)
    .neq('id', currentProductId)
    .limit(limit);

  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      section:sections(*)
    `)
    .limit(limit);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

// User Profile Functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users_profile')
    .upsert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }

  return data;
}

// Cart Functions
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }

  return data || [];
}

export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem | null> {
  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cart item:', error);
      return null;
    }

    return data;
  } else {
    // Add new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return null;
    }

    return data;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating cart item quantity:', error);
    return null;
  }

  return data;
}

export async function removeFromCart(itemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error removing from cart:', error);
    return false;
  }

  return true;
}

export async function clearCart(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    return false;
  }

  return true;
}

// Order Functions
export async function createOrder(userId: string, totalAmount: number, cartItems: CartItem[]): Promise<Order | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      order_status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }

  // Create order items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product?.price || 0
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }

  return order;
}

export async function updateOrderPayment(orderId: string, paymentId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_id: paymentId,
      order_status: 'paid'
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order payment:', error);
    return null;
  }

  return data;
}

export async function getUserOrders(userId: string, status?: string[]): Promise<Order[]> {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status && status.length > 0) {
    query = query.in('order_status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  return data || [];
}

export async function getOrderStats(userId: string): Promise<{
  total: number;
  pending: number;
  delivered: number;
}> {
  const { data, error } = await supabase
    .from('orders')
    .select('order_status')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching order stats:', error);
    return { total: 0, pending: 0, delivered: 0 };
  }

  const stats = data.reduce((acc, order) => {
    acc.total++;
    if (order.order_status === 'pending' || order.order_status === 'paid' || order.order_status === 'shipped') {
      acc.pending++;
    } else if (order.order_status === 'delivered') {
      acc.delivered++;
    }
    return acc;
  }, { total: 0, pending: 0, delivered: 0 });

  return stats;
}

// Contact Functions
export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage | null> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact message:', error);
    return null;
  }

  return data;
}