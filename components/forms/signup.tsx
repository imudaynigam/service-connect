'use client';
import { useState, useRef, KeyboardEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpCustomer } from '../../../app/action/actions'; // New server action

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
];

export default function Signup({
  onSignupSuccess,
}: {
  onSignupSuccess: () => void;
}) {
  const router = useRouter();
  const [state, setState] = useState({
    countryCode: '+91',
    phone: '',
    otp: Array(6).fill(''),
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    isOtpVerified: false,
  });

  const [message, setMessage] = useState<{
    type: 'error' | 'info';
    content: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpRefs = Array(6)
    .fill(null)
    .map(() => useRef<HTMLInputElement>(null));

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
    
      if (!state.isOtpVerified) {
        setMessage({ type: 'error', content: 'Please verify OTP first' });
        return;
      }
    
      if (state.password !== state.confirmPassword) {
        setMessage({ type: 'error', content: 'Passwords do not match.' });
        return;
      }
    
      try {
        const response = await signUpCustomer({
          countryCode: state.countryCode,
          phone: state.phone,
          password: state.password,
        });
    
        if (response.success && response.customerId) { // Fix here
          localStorage.setItem("customer_id", response.customerId); // Fix here
          console.log("customer id is:",localStorage.getItem("customer_id")); // Fix here                              
          setMessage({ type: 'info', content: 'Signup successful! You can now log in with your phone number and password.' });
          onSignupSuccess();
        } else {
          setMessage({ type: 'error', content: response.error || 'Signup failed. Please try again.' });
        }
      } catch (error) {
        setMessage({ type: 'error', content: 'An error occurred. Please try again.' });
      }
    };
    
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      phone: e.target.value.replace(/\D/g, '').slice(0, 10),
    }));
  };

  const generateOTP = () => {
    if (state.phone.length !== 10)
      return setMessage({ type: 'error', content: 'Invalid phone number' });

    setState((prev) => ({
      ...prev,
      otp: Array(6).fill(''),
      isOtpVerified: false,
    }));
    setMessage({ type: 'info', content: 'OTP sent to your number' });
    otpRefs[0].current?.focus();
  };

  const handleOTP = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== '') return;

    const newOTP = [...state.otp];
    newOTP[index] = value;

    setState((prev) => ({ ...prev, otp: newOTP }));
    if (value && index < 5) otpRefs[index + 1].current?.focus();
    if (newOTP.every((d) => d) && newOTP.join('').length === 6)
      verifyOTP(newOTP.join(''));
  };

  const verifyOTP = (otp: string) => {
    setTimeout(() => {
      setState((prev) => ({ ...prev, isOtpVerified: true }));
      setMessage({ type: 'info', content: 'OTP verified successfully!' });
    }, 500);
  };

  const PasswordInput = ({
    value,
    onChange,
    show,
    toggle,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    toggle: () => void;
    placeholder: string;
  }) => (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        {message && (
          <p
            className={`text-center mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}
          >
            {message.content}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <select
              value={state.countryCode}
              onChange={(e) =>
                setState((prev) => ({ ...prev, countryCode: e.target.value }))
              }
              className="p-2 border rounded-md bg-gray-50 w-24"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={state.phone}
              onChange={handlePhoneChange}
              placeholder="Phone Number"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              maxLength={10}
            />
          </div>

          <button
            type="button"
            onClick={generateOTP}
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Get OTP
          </button>

          <div className="flex gap-2 justify-center">
            {state.otp.map((digit, i) => (
              <input
                key={i}
                ref={otpRefs[i]}
                value={digit}
                onChange={(e) => handleOTP(i, e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Backspace' &&
                  !digit &&
                  i > 0 &&
                  otpRefs[i - 1].current?.focus()
                }
                maxLength={1}
                className="w-12 h-12 text-center text-xl border-2 rounded-md focus:border-blue-500"
              />
            ))}
          </div>

          <PasswordInput
            value={state.password}
            onChange={(v) => setState((prev) => ({ ...prev, password: v }))}
            show={state.showPassword}
            toggle={() =>
              setState((prev) => ({
                ...prev,
                showPassword: !prev.showPassword,
              }))
            }
            placeholder="Create Password"
          />

          <PasswordInput
            value={state.confirmPassword}
            onChange={(v) =>
              setState((prev) => ({ ...prev, confirmPassword: v }))
            }
            show={state.showConfirmPassword}
            toggle={() =>
              setState((prev) => ({
                ...prev,
                showConfirmPassword: !prev.showConfirmPassword,
              }))
            }
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 text-white rounded-md ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">OR</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full p-2 flex items-center justify-center gap-2 border rounded-md hover:bg-gray-50"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
