"use client"

import Image from "next/image"
import EventDetailsSection from "@/components/event-details-section"
import RegistrationButton from "@/components/registration-button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
      {/* Admin Button */}
      <Link 
        href="/admin"
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 text-xs sm:text-sm font-semibold"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden sm:inline">ADMIN</span>
      </Link>

      <main>
        {/* Hero / Header Section */}
        <section className="relative pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 md:pb-16 overflow-hidden">
          {/* 3D Background Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {/* Animated 3D Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            style={{ transform: "translateZ(50px)" }}
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"
            style={{ transform: "translateZ(50px)" }}
          />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ perspective: "1000px" }}>
            {/* ICFAI Logo */}
            <div className="flex justify-center mb-6 sm:mb-7 md:mb-8">
              <div className="w-20 sm:w-24 md:w-28 lg:w-32 relative">
                <Image
                  src="/images/icfailogo.png"
                  alt="ICFAI University Tripura"
                  width={100}
                  height={100}
                  className="w-full h-auto object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Event Title with 3D Text */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="text-center mb-6 sm:mb-8 md:mb-10 max-w-5xl mx-auto"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 px-2"
                style={{ 
                  background: "linear-gradient(135deg, #0b2b54 0%, #1e5a9e 50%, #0b2b54 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 4px 20px rgba(11, 43, 84, 0.3)",
                  transform: "translateZ(40px)"
                }}
              >
                HACK-TO-HIRE IDEATHON 2025
              </motion.h1>
              
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                className="h-1 w-20 sm:w-28 mx-auto mb-4 sm:mb-5 rounded-full relative overflow-hidden"
                style={{ transform: "translateZ(30px)" }}
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b2b54] via-[#1e5a9e] to-[#0b2b54]" />
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-bold mb-4 sm:mb-5 md:mb-6 px-4"
                style={{ transform: "translateZ(20px)" }}
              >
                From Concept to Creation — Hack It Out!
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="space-y-1.5 sm:space-y-2 px-4"
                style={{ transform: "translateZ(10px)" }}
              >
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                  Organized by <span className="font-bold text-[#0b2b54]">Startup Incubation Center, IIC, ICFAI University Tripura</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  in collaboration with <span className="font-semibold text-[#1e5a9e]">Trikaya</span> and <span className="font-semibold text-[#1e5a9e]">BeetleX</span>
                </p>
              </motion.div>
            </motion.div>

            {/* Event Poster with 3D Card Effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              className="flex justify-center mb-8 sm:mb-10 md:mb-12"
              style={{ perspective: "1500px" }}
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.03,
                  rotateY: 5,
                  rotateX: -5
                }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl lg:max-w-3xl px-4"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative group">
                  {/* 3D Glow Effect */}
                  <motion.div 
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-2xl blur-xl"
                    style={{ transform: "translateZ(-10px)" }}
                  />
                  
                  {/* Glass Card Container */}
                  <div className="relative bg-white/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl border border-white/60"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                      <Image
                        src="/images/poster.png"
                        alt="HACK-TO-HIRE Ideathon 2025 Poster"
                        width={900}
                        height={506}
                        className="w-full h-auto"
                        priority
                      />
                      {/* Shimmer Effect */}
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Call to Action with 3D Button */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
              className="text-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="mb-5 sm:mb-6">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2.5 sm:mb-3 px-4"
                  style={{ transform: "translateZ(15px)" }}
                >
                  Ready to showcase your innovation?
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                  className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6 max-w-2xl mx-auto px-4"
                  style={{ transform: "translateZ(10px)" }}
                >
                  Join us on <strong className="text-[#0b2b54]">17th November 2025</strong> at <strong className="text-[#0b2b54]">Civil Auditorium</strong>. 
                  <br className="hidden sm:block" />
                  Register your team and compete in <strong>Blockchain</strong>, <strong>AIML</strong>, or <strong>Open Innovation</strong> domains!
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8, ease: "backOut" }}
                style={{ transform: "translateZ(25px)" }}
              >
                <RegistrationButton />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Event Details Section */}
        <EventDetailsSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#0b2b54] to-[#1e5a9e] text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base md:text-lg font-semibold mb-2"
          >
            Organized by Startup Incubation Center & IIC, ICFAI University Tripura
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm mb-3"
          >
            In collaboration with <strong>Trikaya</strong> & <strong>BeetleX</strong>
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-blue-200"
          >
            © 2025 HACK-TO-HIRE Ideathon. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  )
}

