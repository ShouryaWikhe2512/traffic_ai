"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "../components/navbar";

export default function IndianTrafficControl() {
  useEffect(() => {
    // Traffic light cycling using setInterval
    const lights = document.querySelectorAll(".signal-light");
    lights.forEach((light, idx) => {
      setTimeout(() => {
        let colorIndex = 0;
        setInterval(() => {
          const colors = ["#ef4444", "#fbbf24", "#22c55e"];
          (light as HTMLElement).style.backgroundColor = colors[colorIndex % 3];
          colorIndex++;
        }, 2000);
      }, idx * 600);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-300 to-gray-300 relative  ">
      <Navbar />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-6 lg:px-16 py-20 pt-32 relative z-10">
        {/* Background GIF - Sticks with Hero Section */}
        {/* Background Video - Sticks with Hero Section */}
        <div className="absolute top-0 right-0 bottom-0 z-10 opacity-50 w-full lg:w-[70%] overflow-hidden">
          <video
            src="/intovehivle.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-60% h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
            >
              Smart City Initiative
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              AI Traffic Control for{" "}
              <span className="text-orange-400">Indian Cities</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Built for bikes, autos, buses and real Indian roads
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 40px rgba(22, 163, 74, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl text-lg shadow-lg hover:bg-green-700 transition-all duration-300"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Enter Control Room
            </motion.button>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-6"
            >
              {[
                { value: "1200+", label: "Junctions" },
                { value: "6 sec", label: "Response" },
                { value: "45%", label: "Congestion ↓" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Junction Visualization */}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-16 py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-900 mb-12"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Built for Indian Roads
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚦",
                title: "Smart Signals",
                desc: "Adaptive traffic lights respond to real-time density at intersections",
              },
              {
                icon: "🚑",
                title: "Emergency Priority",
                desc: "Green corridor activated in 6 seconds for ambulances and fire trucks",
              },
              {
                icon: "🎆",
                title: "Festival Traffic Handling",
                desc: "Special algorithms for Diwali, Holi, Ganesh Chaturthi crowds",
              },
              {
                icon: "🇮🇳",
                title: "Indian Road Adaptation",
                desc: "AI trained on mixed traffic patterns: autos, bikes, buses, cows",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-bold mb-2 text-gray-900"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");
      `}</style>
    </div>
  );
}
