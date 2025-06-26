'use client';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Login({ 
  onSignupClick, 
  onBackClick, 
  onLoginSuccess 
}: { 
  onSignupClick: () => void;
  onBackClick: () => void;
  onLoginSuccess: () => void;
}) {
  const [state, setState] = useState({
    identifier: '',
    password: '',
    showPassword: false,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    onLoginSuccess();
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2 px-4">
      <div className="w-full max-w-[400px] border border-gray-300 bg-white shadow-lg rounded-2xl p-8 relative">
        <button 
          onClick={onBackClick}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <p className="text-gray-600 mb-6 text-center">Welcome back! Please log in to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Phone number or Email</label>
            <input
              type="text"
              value={state.identifier}
              onChange={(e) => setState(prev => ({ ...prev, identifier: e.target.value }))}
              placeholder="Enter phone number or email"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type={state.showPassword ? 'text' : 'password'}
              value={state.password}
              onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
              className="absolute right-3 top-1/2 text-gray-500 hover:text-gray-700"
            >
              {state.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Link 
            href="/forgot-password" 
            className="block text-right text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            Not a Member?{' '}
            <button
              onClick={onSignupClick}
              className="text-blue-500 hover:underline font-medium"
            >
              Signup
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
