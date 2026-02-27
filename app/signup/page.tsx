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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/login?message=Check your email to confirm your account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignup = async () => {
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
      title="Join Our Community"
      subtitle="Start your wellness journey with us today"
      heroImage="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1080&h=1920&fit=crop"
      heroTitle="Welcome to Pansarika"
      heroSubtitle="Your Gateway to Authentic Wellness"
      heroDescription="Join thousands of customers who trust us for pure, traditional herbs and spices sourced directly from the Himalayas."
      heroFeatures={[
        "100% Pure & Natural Products",
        "Direct from Himalayan Sources",
        "Traditional Wellness Wisdom"
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-forest-green font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              required
              className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-forest-green font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
              required
              className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-forest-green font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
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

        <div>
          <Label htmlFor="confirmPassword" className="text-forest-green font-medium">
            Confirm Password
          </Label>
          <div className="relative mt-2">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              className="border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-forest-green transition-colors duration-300"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-forest-green focus:ring-forest-green border-gray-300 rounded mt-1"
          />
          <Label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-forest-green hover:text-soft-gold font-medium">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-forest-green hover:text-soft-gold font-medium">
              Privacy Policy
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
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

        {/* Google Sign Up */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-semibold"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign up with Google
        </Button>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/login" className="text-forest-green hover:text-soft-gold font-semibold transition-colors duration-300">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}