'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function ProfileSection() {
  const [profile, setProfile] = useState<any>(null);
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndServices = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }
        setProfile(profileData);

        // Fetch service count
        const { count, error: serviceError } = await supabase
          .from('services')
          .select('*', { count: 'exact', head: true })
          .eq('provider_id', user.id);
        if (serviceError) {
          console.error('Error fetching service count:', serviceError);
          setServiceCount(0);
        } else {
          setServiceCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching profile/services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndServices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-8 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-32 mb-1 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={profile?.profile_picture || '/images/default-profile.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {profile?.full_name || 'Loading...'}
          </h3>
          <p className="text-gray-500 text-xs truncate">
            {profile?.city || 'Location not set'}
          </p>
        </div>
      </div>
      
      {profile && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Services</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {serviceCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}