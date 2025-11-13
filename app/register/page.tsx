"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RegistrationForm from "@/components/registration-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10">
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
            </div>
            
            <div className="text-center mt-3 sm:hidden">
              <h1 className="text-lg font-bold">Team Registration</h1>
              <p className="text-xs text-blue-100">HACK-TO-HIRE Ideathon 2025</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>

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
