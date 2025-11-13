"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Phone, Blocks, Brain, Lightbulb } from "lucide-react"

export default function EventDetailsSection() {
  const details = [
    { icon: Calendar, label: "Date", value: "17th November 2025" },
    { icon: Clock, label: "Time", value: "10:00 AM onwards" },
    { icon: MapPin, label: "Venue", value: "Civil Lab Auditorium" },
    { icon: Phone, label: "Contact", value: "+91 9077255903" },
  ]

  const domains = [
    {
      icon: Blocks,
      title: "Blockchain",
      description: "Decentralized solutions & smart contracts",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: Brain,
      title: "AIML",
      description: "Artificial Intelligence & Machine Learning",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Lightbulb,
      title: "Open Innovation",
      description: "Creative problem-solving & novel ideas",
      color: "from-orange-500 to-orange-700",
    },
  ]

  return (
    <section className="py-8 sm:py-10 md:py-14 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ perspective: "1500px" }}>
        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-6 sm:mb-7 md:mb-8 px-4"
            style={{ 
              background: "linear-gradient(135deg, #0b2b54 0%, #1e5a9e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Event Details
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {details.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -8, 
                  rotateY: 5,
                  scale: 1.03,
                  boxShadow: "0 20px 40px -10px rgba(11, 43, 84, 0.3)"
                }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glass Card with 3D Effect */}
                <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 sm:p-5 shadow-lg border border-white/80 transition-all duration-300 h-full"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="p-2 sm:p-2.5 rounded-lg flex-shrink-0 relative"
                      style={{ 
                        background: "linear-gradient(135deg, #0b2b54 0%, #1e5a9e 100%)",
                        boxShadow: "0 4px 15px rgba(11, 43, 84, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
                      }}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 font-medium mb-0.5">{item.label}</p>
                      <p className="text-sm sm:text-base font-bold text-gray-900 break-words">{item.value}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Domain Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-6 sm:mb-7 md:mb-8 px-4"
            style={{ 
              background: "linear-gradient(135deg, #0b2b54 0%, #1e5a9e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Competition Domains
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, scale: 0.85, rotateX: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -12,
                  rotateY: 5,
                  rotateX: 5
                }}
                className="relative group"
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                {/* Animated Glow */}
                <motion.div 
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                    scale: [0.98, 1.02, 0.98]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  className={`absolute -inset-1 bg-gradient-to-br ${domain.color} rounded-2xl blur-xl opacity-30`}
                  style={{ transform: "translateZ(-20px)" }}
                />
                
                {/* Glass Card */}
                <div className="relative bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl border border-white/90 h-full transition-all duration-300"
                  style={{ transform: "translateZ(30px)" }}
                >
                  {/* Inner Gradient */}
                  <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${domain.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.7 }}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-3 sm:mb-4 relative`}
                      style={{ 
                        boxShadow: "0 8px 20px -6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                        transform: "translateZ(15px)"
                      }}
                    >
                      <domain.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
                    </motion.div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{domain.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{domain.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
