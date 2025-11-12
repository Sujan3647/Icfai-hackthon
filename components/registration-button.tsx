"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function RegistrationButton() {
  return (
    <Link href="/register">
      {/* Registration Button with 3D Effect */}
      <motion.button
        className="relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg text-white overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, #0b2b54 0%, #1e5a9e 50%, #0b2b54 100%)",
          boxShadow: "0 10px 30px -10px rgba(11, 43, 84, 0.5), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)",
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          scale: 1.05,
          y: -5,
          boxShadow: "0 20px 40px -10px rgba(11, 43, 84, 0.6), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.15)",
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0,
          boxShadow: "0 5px 15px -5px rgba(11, 43, 84, 0.4), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
        />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        
        {/* Button Text */}
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🚀
          </motion.span>
          Register Now
        </motion.span>
      </motion.button>
    </Link>
  )
}
