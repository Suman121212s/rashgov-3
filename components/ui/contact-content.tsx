'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, CircleCheck as CheckCircle } from 'lucide-react';

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitContactMessage(formData);
      if (result) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting contact message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-forest-green mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or need assistance? We're here to help you on your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-playfair font-bold text-forest-green mb-8">
              Contact Information
            </h2>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-forest-green/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-green mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Wellness Street<br />
                    Dehradun, Uttarakhand 248001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-forest-green/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-green mb-2">Phone</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-forest-green/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-forest-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-green mb-2">Email</h3>
                  <p className="text-gray-600">hello@pansarika.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-6 bg-forest-green/5 rounded-2xl">
              <h3 className="font-semibold text-forest-green mb-4">Why Choose Pansarika?</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-soft-gold rounded-full"></div>
                  <span>100% Pure & Natural Products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-soft-gold rounded-full"></div>
                  <span>Direct from Himalayan Sources</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-soft-gold rounded-full"></div>
                  <span>Traditional Wellness Wisdom</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-soft-gold rounded-full"></div>
                  <span>Ethically Sourced & Fair Trade</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-playfair font-bold text-forest-green mb-4">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-8">
                  Thank you for reaching out to us. We'll get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-playfair font-bold text-forest-green mb-8">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-forest-green font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
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
                      placeholder="Enter your email address"
                      required
                      className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-forest-green font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      required
                      rows={6}
                      className="mt-2 border-gray-300 focus:border-forest-green focus:ring-forest-green rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-forest-green hover:bg-forest-green/90 text-white py-3 rounded-xl font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}