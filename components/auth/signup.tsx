"use client"

import { useState, useRef } from "react"
import type { FormEvent, ChangeEvent } from "react" // Import specific types
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUpCustomer } from '../../../app/action/actions'; // New server action
import { supabase } from '../../lib/supabaseClient';

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
]

export default function Signup({ onSignupSuccess }: { onSignupSuccess: () => void }) {
  const router = useRouter()
  const [state, setState] = useState({
    countryCode: "+91",
    phone: "",
    otp: Array(6).fill(""),
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    isOtpVerified: false,
  })
  const [step, setStep] = useState<'signup' | 'phone-signin'>("signup");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneSession, setPhoneSession] = useState<any>(null);
  const [message, setMessage] = useState<{ type: "error" | "info"; content: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const otpRefs = Array(6)
    .fill(null)
    .map(() => useRef<HTMLInputElement>(null)) // Moved useRef to top level

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsSubmitting(true)

    if (!state.isOtpVerified) {
      setMessage({ type: "error", content: "Please verify OTP first" })
      setIsSubmitting(false)
      return
    }

    if (state.password !== state.confirmPassword) {
      setMessage({ type: "error", content: "Passwords do not match" })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await signUpCustomer({
        countryCode: state.countryCode,
        phone: state.phone,
        password: state.password,
      })

      if ("error" in response) {
        throw new Error(response.error)
      }

      if (response.customerId) {
        localStorage.setItem("customer_id", response.customerId)
      }

      setMessage({
        type: "info",
        content: "Signup successful! Redirecting...",
      })
      setTimeout(() => router.push("/profile-setup"), 1500)
    } catch (error) {
      console.error("Signup failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again."
      setMessage({ type: "error", content: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
    }))
  }

  const generateOTP = () => {
    if (state.phone.length !== 10) return setMessage({ type: "error", content: "Invalid phone number" })

    setState((prev) => ({
      ...prev,
      otp: Array(6).fill(""),
      isOtpVerified: false,
    }))
    setMessage({ type: "info", content: "OTP sent to your number" })
    otpRefs[0].current?.focus()
  }

  const handleOTP = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== "") return

    const newOTP = [...state.otp]
    newOTP[index] = value

    setState((prev) => ({ ...prev, otp: newOTP }))
    if (value && index < 5) otpRefs[index + 1].current?.focus()
    if (newOTP.every((d) => d) && newOTP.join("").length === 6) verifyOTP(newOTP.join(""))
  }

  const verifyOTP = (otp: string) => {
    setTimeout(() => {
      setState((prev) => ({ ...prev, isOtpVerified: true }))
      setMessage({ type: "info", content: "OTP verified successfully!" })
    }, 500)
  }

  const PasswordInput = ({
    value,
    onChange,
    show,
    toggle,
    placeholder,
  }: {
    value: string
    onChange: (v: string) => void
    show: boolean
    toggle: () => void
    placeholder: string
  }) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  )

  // Phone sign in handler
  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    try {
      const fullPhone = state.countryCode + state.phone;
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
      if (error) throw error;
      setOtpSent(true);
      setMessage({ type: "info", content: "OTP sent to your phone number." });
    } catch (error: any) {
      setMessage({ type: "error", content: error.message || "Failed to send OTP." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phone OTP verify handler
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const fullPhone = state.countryCode + state.phone;
      const otp = state.otp.join("");
      const { error, data } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otp, type: "sms" });
      if (error) throw error;
      setMessage({ type: "info", content: "Phone verified and signed in!" });
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      setMessage({ type: "error", content: error.message || "OTP verification failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2 px-30">
      <Link href="/" className="flex items-center justify-center mb-8">
        <span className="ml-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
          Service Connect
        </span>
      </Link>
      <div className="w-full max-w-[400px] border border-gray-300 bg-white shadow-lg rounded-2xl p-10">
        <div className="flex justify-between mb-4">
          <button className={`font-bold ${step === 'signup' ? 'text-blue-600' : 'text-gray-400'}`} onClick={() => { setStep('signup'); setOtpSent(false); setMessage(null); }}>Sign Up</button>
          <button className={`font-bold ${step === 'phone-signin' ? 'text-blue-600' : 'text-gray-400'}`} onClick={() => { setStep('phone-signin'); setOtpSent(false); setMessage(null); }}>Sign In with Phone</button>
        </div>
        {step === 'signup' && (
          <>
            {message && (
              <p className={`text-center mb-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                {message.content}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={state.countryCode}
                  onChange={(e) => setState((prev) => ({ ...prev, countryCode: e.target.value }))}
                  className="w-[100px] px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  maxLength={10}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={generateOTP}
                className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600 transition duration-300"
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
                    onKeyDown={(e) => e.key === "Backspace" && !digit && i > 0 && otpRefs[i - 1].current?.focus()}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <PasswordInput
                value={state.password}
                onChange={(v) => setState((prev) => ({ ...prev, password: v }))}
                show={state.showPassword}
                toggle={() => setState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
                placeholder="Create Password"
              />
              <PasswordInput
                value={state.confirmPassword}
                onChange={(v) => setState((prev) => ({ ...prev, confirmPassword: v }))}
                show={state.showConfirmPassword}
                toggle={() => setState((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                placeholder="Confirm Password"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
              <button className="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-3xl hover:bg-gray-50 transition duration-300 flex items-center justify-center">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              By continuing, you agree to our{" "}
              <Link href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </>
        )}
        {step === 'phone-signin' && (
          <form onSubmit={otpSent ? handleVerifyPhoneOtp : handlePhoneSignIn} className="space-y-4">
            <div className="flex gap-2">
              <select
                value={state.countryCode}
                onChange={e => setState(prev => ({ ...prev, countryCode: e.target.value }))}
                className="w-[100px] px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                value={state.phone}
                onChange={handlePhoneChange}
                placeholder="Phone Number"
                maxLength={10}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {otpSent ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-center">
                  {state.otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      value={digit}
                      onChange={e => handleOTP(i, e.target.value)}
                      onKeyDown={e => e.key === "Backspace" && !digit && i > 0 && otpRefs[i - 1].current?.focus()}
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP & Sign In"}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-3xl hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}