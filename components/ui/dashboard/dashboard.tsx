'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainServiceButton from './ServiceButtons/MainServiceButton';
import AdditionalServiceButton from './ServiceButtons/AdditionalServiceButton';
import ServicePopup from '../../forms/servicepopup';
import Card from './card';
import GridIcon from '../gridicon'; // Importing GridIcon component
import { useRouter } from 'next/navigation';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showServicePopup, setShowServicePopup] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [hasServices, setHasServices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('provider_id', user.id)
        .eq('read', false);

      if (error && error.message) {
        console.error('Error fetching notifications:', error.message);
        return;
      }

      setNotificationCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchServices = async () => {
    try {
      // Fetch all services, not just those by the current user
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
      setHasServices((data || []).length > 0);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    fetchServices();
  }, []);

  // Open the popup for either service type.
  const handleServiceClick = (type: 'main' | 'additional') => {
    setIsSidebarOpen(false);
    setSelectedService({ service_type: type });
    setShowServicePopup(true);
  };

  // Save new service data.
  const handleSaveService = (serviceData: any) => {
    setServices((prev) => {
      const newServices = [serviceData, ...prev];
      setHasServices(newServices.length > 0);
      return newServices;
    });
    setShowServicePopup(false);
    setSelectedService(null);
  };

  // Edit an existing service.
  const handleEditService = (id: number) => {
    const serviceToEdit = services.find((s) => s.id === id);
    setSelectedService(serviceToEdit);
    setShowServicePopup(true);
  };

  // Increment likes.
  const handleLikeService = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? { ...service, likes: (service.likes || 0) + 1 }
          : service,
      ),
    );
  };

  // Razorpay payment handler
  const handleBuyService = async (service: any) => {
    // Load Razorpay script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to buy a service.');
        return;
      }
      // Create order on backend
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: service.cost,
          currency: 'INR',
          receipt: `order_rcptid_${service.id}`,
        }),
      });
      const order = await response.json();
      if (!order.id) {
        alert('Failed to create Razorpay order.');
        return;
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // <-- Put your Razorpay Key ID in .env.local as NEXT_PUBLIC_RAZORPAY_KEY_ID
        amount: order.amount,
        currency: order.currency,
        name: service.service_name,
        description: service.description,
        image: service.image_url || '/images/placeholder.svg',
        order_id: order.id, // Razorpay order ID from backend
        handler: async function (response: any) {
          // Insert order into Supabase after payment success
          const { error } = await supabase.from('orders').insert({
            service_id: service.id,
            buyer_id: user.id,
            provider_id: service.provider_id,
            amount: Number(service.cost),
            currency: 'INR',
            razorpay_payment_id: response.razorpay_payment_id,
            status: 'paid',
          });
          if (error) {
            alert('Payment succeeded, but failed to record order: ' + error.message);
          } else {
            alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          }
        },
        prefill: {},
        theme: { color: '#6366f1' },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0 visible pointer-events-auto' : 'md:-translate-x-64 -translate-x-[-100%] invisible pointer-events-none'}
      `}>
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onLogout={onLogout}
          onServiceClick={handleServiceClick}
          hasServices={hasServices}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col ${
        isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
      }`}>
        <Navbar 
          onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNotificationClick={() => router.push('/notifications')}
          notificationCount={notificationCount}
          profile={profile}
          handleLogout={onLogout}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-auto">
          {!hasServices && (
            <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-8 mt-8 sm:mt-16 md:mt-32 px-4 sm:px-0">
              <MainServiceButton onClick={() => handleServiceClick('main')} />
              <AdditionalServiceButton onClick={() => handleServiceClick('additional')} />
            </div>
          )}

          {hasServices && (
            <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  id={service.id}
                  serviceName={service.service_name}
                  serviceCost={service.cost}
                  serviceDescription={service.description}
                  image={service.image_url || '/images/placeholder.svg'}
                  likes={service.likes || 0}
                  onEdit={handleEditService}
                  onLike={handleLikeService}
                  onBuy={() => handleBuyService(service)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Add the GridIcon at the bottom center */}
        <GridIcon onClick={() => handleServiceClick('main')} />
      </div>

      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {showServicePopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <ServicePopup
            onSave={handleSaveService}
            onClose={() => {
              setShowServicePopup(false);
              setSelectedService(null);
            }}
            initialData={selectedService}
          />
        </div>
      )}
    </div>
  );
}
