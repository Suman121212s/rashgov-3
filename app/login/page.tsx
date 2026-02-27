'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/ui/auth-layout';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your wellness journey"
      heroImage="https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop"
      heroTitle="Pansarika"
      heroSubtitle="Bringing Himalayan Purity to Your Home"
      heroDescription="Experience the authentic taste of traditional wellness with our premium collection of pure Himalayan herbs and spices."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-forest-green font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-forest-green font-medium">
            Password
          </Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-forest-green transition-colors duration-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-forest-green focus:ring-forest-green border-gray-300 rounded"
            />
            <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </Label>
          </div>
          <Link href="/forgot-password" className="text-sm text-soft-gold hover:text-soft-gold/80 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-warm-white text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-semibold"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </Button>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/signup" className="text-forest-green hover:text-soft-gold font-semibold transition-colors duration-300">
            Create one
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}