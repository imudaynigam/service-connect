'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { collectUserData } from '../../../app/action/actions';

export default function UserData({ onBack, onSave }: { 
  onBack: () => void;
  onSave: (data: { username: string; email: string; image: string; city: string; pincode: string; description: string }) => void;
}) {
  const [state, setState] = useState({
    profileImage: null as File | null,
    username: '',
    email: '',
    otp: Array(6).fill(''),
    city: '',
    pincode: '',
    description: '',
    showVerification: false,
    isVerified: false,
    showOtpField: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = Array(6).fill(null).map(() => useRef<HTMLInputElement>(null));

  useEffect(() => {
    if (state.isVerified) {
      setSuccess(true);
      const timer = setTimeout(() => {
        setSuccess(false);
        setState(prev => ({ ...prev, showOtpField: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.isVerified]);

  const handleImage = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setState(prev => ({ ...prev, profileImage: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    const defaultImageUrl = "https://example.com/default-profile.png"; // Replace with actual default image URL
  
    const storedCustomerId = localStorage.getItem("customer_id"); // Retrieve stored customer ID
    if (!storedCustomerId) {
      setError("Customer ID is missing. Please sign up again.");
      return;
    }
  
    // Call the server function to save data
    const response = await collectUserData({
      customerId: storedCustomerId, // Use stored ID
      username: state.username,
      email: state.email,
      imageUrl: defaultImageUrl,
      city: state.city,
      pincode: state.pincode,
      description: state.description,
    });
    if (response.success) {
      setSuccess(true);
      if (typeof onSave === "function") {
        onSave({
          username: state.username,
          email: state.email,
          image: defaultImageUrl,
          city: state.city,
          pincode: state.pincode,
          description: state.description,
        });
      } else {
        console.error("onSave is not a function");
      }
    }    
  };
  
  const verifyEmail = () => {
    if (!state.profileImage) return setError('Please upload profile image');
    if (state.email.endsWith('@gmail.com')) {
      setState(prev => ({ ...prev, showVerification: true }));
      setError(null);
    }
  };

  const handleOTP = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOTP = [...state.otp];
    newOTP[index] = value;
    
    setState(prev => ({ ...prev, otp: newOTP }));
    if (value && index < 5) otpRefs[index + 1].current?.focus();
    if (newOTP.every(d => d) && newOTP.join('').length === 6) {
      setState(prev => ({ ...prev, isVerified: true }));
      setError(null);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2 px-4">
      <div className="w-full max-w-[400px] border border-gray-300 bg-white shadow-lg rounded-2xl p-8 relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-4">Create Your Profile</h1>
        <p className="text-gray-600 mb-6 text-center">Complete your profile to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <div
              onClick={handleImage}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative"
            >
              {state.profileImage ? (
                <img
                  src={URL.createObjectURL(state.profileImage)}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <>
                  <Camera className="text-gray-500 w-8 h-8" />
                  <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                    <Camera className="w-4 h-4" />
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-gray-500 text-sm mt-2">Click to upload profile picture</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              value={state.username}
              onChange={(e) => setState(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={verifyEmail}
                className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                Verify
              </button>
            </div>
          </div>

          {state.showVerification && state.showOtpField && (
            <div>
              <label className="block text-gray-700 mb-1">OTP Verification</label>
              <div className="flex gap-2 justify-center">
                {state.otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    value={digit}
                    onChange={(e) => handleOTP(i, e.target.value)}
                    onKeyDown={(e) => e.key === 'Backspace' && !digit && i > 0 && otpRefs[i-1].current?.focus()}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={1}
                  />
                ))}
              </div>
              {success && (
                <p className="text-green-500 text-center mt-2">OTP verified successfully!</p>
              )}
            </div>
          )}

          {state.isVerified && (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    value={state.city}
                    onChange={(e) => setState(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Pincode</label>
                  <input
                    value={state.pincode}
                    onChange={(e) => setState(prev => ({ 
                      ...prev, 
                      pincode: e.target.value.replace(/\D/g, '').slice(0, 6) 
                    }))}
                    placeholder="Enter pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">About You</label>
                <textarea
                  value={state.description}
                  onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600 transition duration-300"
              >
                Save Profile
              </button>
            </>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}