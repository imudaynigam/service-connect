'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/sections/header/headersection';
import Hero from '../components/sections/HeroSection/herosection';
import About from '../components/sections/about/aboutsection';
import Contact from '../components/sections/contact/contactsection';
import Footer from '../components/sections/footer/footer';
import AuthForm from '../components/auth/AuthForm';

export default function LandingPage() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasMounted(true);
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Session found, checking profile...');
          // Check if user has a profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            console.log('Profile found, redirecting to dashboard');
            router.push('/dashboard');
          } else {
            console.log('No profile found, redirecting to profile setup');
            router.push('/profile-setup');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change on main page:', event, session?.user?.email);
      
      if (session && (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED")) {
        console.log('User signed in, checking profile...');
        try {
          // Check if user has a profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            console.log('Profile found, redirecting to dashboard');
            router.push('/dashboard');
          } else {
            console.log('No profile found, redirecting to profile setup');
            router.push('/profile-setup');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          // If there's an error checking profile, redirect to profile setup
          router.push('/profile-setup');
        }
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // Avoid rendering until client-side mount to prevent hydration issues.
  if (!hasMounted || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleExploreServices = () => {
    router.push('/explore');
  };

  return (
    <main className="w-full min-h-screen overflow-hidden relative">
      <Header 
        onLogin={() => { setAuthStep('login'); setShowAuth(true); }}
        onSignup={() => { setAuthStep('signup'); setShowAuth(true); }}
      />
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowAuth(false)}
            >
              ✕
            </button>
            <AuthForm initialStep={authStep} />
          </div>
        </div>
      )}
      <section id="home" className="w-full">
        <Hero
          onGetStarted={undefined}
          onExploreServices={handleExploreServices}
        />
      </section>
      <section id="about" className="w-full">
        <About />
      </section>
      <section id="contact" className="w-full">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
