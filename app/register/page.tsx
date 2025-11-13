"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RegistrationForm from "@/components/registration-form"
import Image from "next/image"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { Session } from "@supabase/supabase-js"

export default function RegisterPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/register`,
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
      alert('Failed to sign in with Google. Please try again.')
    }
  }

  const signOut = async () => {
    await supabaseBrowser.auth.signOut()
    setSession(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0b2b54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show Google sign-in
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] text-white py-4 sm:py-6 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs sm:text-sm font-medium">Back to Home</span>
                </Link>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                    <Image
                      src="/images/icfailogo.png"
                      alt="ICFAI"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain drop-shadow-md"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Sign-In Card */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
                {/* Logo */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <Image
                      src="/images/icfailogo.png"
                      alt="ICFAI University Tripura"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2b54] mb-2">
                    Sign in to Register
                  </h2>
                  <p className="text-gray-600">
                    HACK-TO-HIRE Ideathon 2025
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-[#0b2b54]">🔒 Secure Authentication</strong>
                    <br />
                    Please sign in with your Google account to proceed with team registration.
                  </p>
                </div>

                {/* Google Sign-In Button */}
                <button
                  onClick={signInWithGoogle}
                  className="w-full bg-white border-2 border-gray-300 hover:border-[#0b2b54] hover:shadow-lg transition-all duration-300 rounded-lg py-3 px-4 flex items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-semibold group-hover:text-[#0b2b54] transition-colors">
                    Sign in with Google
                  </span>
                </button>

                {/* Note */}
                <p className="text-xs text-gray-500 text-center mt-6">
                  By signing in, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If authenticated, show registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] text-white py-4 sm:py-6 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              {/* Back Button */}
              <Link 
                href="/"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Back to Home</span>
              </Link>
              
              {/* Logo and Title - Centered */}
              <div className="flex items-center gap-2 sm:gap-3 absolute left-1/2 -translate-x-1/2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                  <Image
                    src="/images/icfailogo.png"
                    alt="ICFAI"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain drop-shadow-md"
                    priority
                  />
                </div>
                <div className="text-center hidden sm:block">
                  <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold whitespace-nowrap">
                    Team Registration
                  </h1>
                  <p className="text-[10px] sm:text-xs text-blue-100 font-medium">
                    HACK-TO-HIRE Ideathon 2025
                  </p>
                </div>
              </div>
              
              {/* User Info & Sign Out */}
              <div className="flex items-center gap-2">
                {session?.user?.email && (
                  <div className="hidden md:block text-right mr-2">
                    <p className="text-xs text-blue-100">{session.user.email}</p>
                  </div>
                )}
                <button
                  onClick={signOut}
                  className="text-xs sm:text-sm px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
            
            {/* Mobile Title - Below on small screens */}
            <div className="text-center mt-3 sm:hidden">
              <h1 className="text-lg font-bold">Team Registration</h1>
              <p className="text-xs text-blue-100">HACK-TO-HIRE Ideathon 2025</p>
            </div>
          </div>
        </div>

        {/* Registration Form Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Form Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Content */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <footer className="bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] text-white py-4 sm:py-6 mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs sm:text-sm font-semibold mb-1">
              Organized by Startup Incubation Center & IIC, ICFAI University Tripura
            </p>
            <p className="text-[10px] sm:text-xs text-blue-200">
              © 2025 HACK-TO-HIRE Ideathon. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
