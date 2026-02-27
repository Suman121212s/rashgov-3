'use client';

import { useEffect, useState } from 'react';
import { supabase, getUserProfile, upsertUserProfile, UserProfile } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Save, CircleCheck as CheckCircle } from 'lucide-react';

export default function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);

        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);

        // Set form data
        setFormData({
          full_name: userProfile?.full_name || user.user_metadata?.full_name || '',
          email: userProfile?.email || user.email || '',
          phone: userProfile?.phone || '',
          address: userProfile?.address || '',
          city: userProfile?.city || '',
          state: userProfile?.state || '',
          pincode: userProfile?.pincode || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updatedProfile = await upsertUserProfile({
        id: user.id,
        ...formData
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-forest-green text-white p-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-4 rounded-full">
                <UserIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-playfair font-bold">Profile Settings</h1>
                <p className="text-white/80">Manage your personal information</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name" className="text-forest-green font-medium">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
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
                  placeholder="Enter your email"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-forest-green font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="pincode" className="text-forest-green font-medium">
                  PIN Code
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter PIN code"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-forest-green font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-forest-green font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-forest-green font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {saved && (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Profile saved successfully!</span>
                  </>
                )}
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-3 rounded-xl font-semibold"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}