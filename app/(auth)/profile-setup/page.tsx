"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [about, setAbout] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Get current user
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Handle image upload to Supabase Storage
  async function uploadImage(file: File, userId: string) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}.${fileExt}`;
    const { error } = await supabase.storage.from('profile-pictures').upload(filePath, file, { upsert: true });
    if (error) throw error;
    // Get public URL
    const { data } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Phone validation
  const validatePhone = async (value: string) => {
    // Check for 10 digits
    if (!/^\d{10}$/.test(value)) {
      setPhoneError("Phone number must be 10 digits");
      return false;
    }
    // Check uniqueness in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', value)
      .single();
    if (data) {
      setPhoneError("This phone number is already in use");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Send OTP using Supabase
  const handleSendOtp = async () => {
    setPhoneError("");
    setOtpError("");
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: "+91" + phone });
      if (error) {
        setPhoneError(error.message);
        return;
      }
      setOtpSent(true);
      setMessage("OTP sent to your phone number");
    } catch (err: any) {
      setPhoneError(err.message);
    }
  };

  // Verify OTP using Supabase
  const handleVerifyOtp = async () => {
    setOtpError("");
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: "+91" + phone, token: otp, type: "sms" });
      if (error) {
        setOtpError(error.message);
        return;
      }
      setPhoneVerified(true);
      setMessage("Phone number verified!");
    } catch (err: any) {
      setOtpError(err.message);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!phoneVerified) {
        setLoading(false);
        setPhoneError("Please verify your phone number with OTP");
        return;
      }
      if (!(await validatePhone(phone))) {
        setLoading(false);
        return;
      }
      const user = await getUser();
      if (!user) throw new Error("Not logged in");
      let imageUrl = null;
      if (profilePicture) {
        imageUrl = await uploadImage(profilePicture, user.id);
      }
      // Upsert profile
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        email: email || user.email,
        phone,
        city,
        pincode,
        about,
        profile_picture: imageUrl,
      });
      if (error) throw error;
      setMessage("Profile saved!");
      router.push('/dashboard');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setProfilePicture(file);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Tell us a bit about yourself to get started</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${
            message.includes('error') || message.includes('failed') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={async e => {
                    setPhone(e.target.value);
                    setPhoneVerified(false);
                    setOtpSent(false);
                    setOtp("");
                    if (e.target.value.length === 10) {
                      await validatePhone(e.target.value);
                    } else {
                      setPhoneError("");
                    }
                  }}
                  className={`w-full px-4 py-3 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  required
                  disabled={phoneVerified}
                />
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
              {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              {otpSent && !phoneVerified && (
                <div className="mt-2 flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  >
                    Verify OTP
                  </button>
                  {otpError && <span className="text-red-500 text-xs ml-2">{otpError}</span>}
                </div>
              )}
              {phoneVerified && <p className="text-green-600 text-xs mt-1">Phone number verified!</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                City
              </label>
              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pincode
              </label>
              <input
                type="text"
                placeholder="Enter your pincode"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About You
            </label>
            <textarea
              placeholder="Tell us about yourself, your experience, and what services you offer..."
              value={about}
              onChange={e => setAbout(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Setting up your profile...
              </div>
            ) : (
              'Complete Profile Setup'
            )}
          </button>
        </form>
        <button
          type="button"
          className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setMessage("");
            try {
              const user = await getUser();
              if (!user) throw new Error("Not logged in");
              // Upsert minimal profile with skipped flag
              const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                skipped: true,
              });
              if (error) throw error;
              router.push('/');
            } catch (err: any) {
              setMessage(err.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}