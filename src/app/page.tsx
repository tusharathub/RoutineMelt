"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Activity, Calendar, Trophy } from "lucide-react";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="bg-white dark:bg-gray-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Header/Nav */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className={`text-2xl font-bold text-black `}>
            RoutineMelt
          </h2>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`bg-gray-50 text-black py-28 px-6 text-center `}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Zap className={`w-12 h-12 mx-auto mb-4 text-black`} />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Stop Planning. Start <strong>Doing.</strong>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              <strong>RoutineMelt</strong> is the habit tracker that turns your daily tasks into an addictive, visual streak. Build consistency you can <em>see</em>.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/grid"
                className={`px-8 py-4 bg-white text-black text-lg font-bold rounded-xl shadow-2xl  hover:bg-gray-50 transition transform hover:scale-110`}
              >
                Start Building Your Streak (It's Free!)
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto  ">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Visualize Success, Not Just Lists
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              Icon: Calendar,
              title: "The Streak Grid",
              description: "A minimalist, annual calendar view that instantly shows your daily consistency. Green means go!",
            },
            {
              Icon: Trophy,
              title: "Gamified Progress",
              description: "Track your longest streaks and earn badges. Never miss a day and keep the chain strong.",
            },
            {
              Icon: Activity,
              title: "Simple Daily Log",
              description: "Click a square to log tasks, track completion, and see your history without the clutter of a large To-Do list.",
            },
            {
              Icon: Zap,
              title: "Next.js Performance",
              description: "Blazing fast and reliable, built on the modern Next.js stack with MongoDB for secure, stable data.",
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <FeatureCard
                Icon={feature.Icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="demo" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className={`text-sm font-semibold uppercase text-black `}>
              Social Proof
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-3 mb-8">
              "The simplest, most effective habit tracker I've ever used."
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold">
                J
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Jane Doe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Freelancer & Consistency Builder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-100 dark:bg-gray-900">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          It is FREE (pricing is just to fill space)
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              plan: "Free",
              price: "$0",
              features: ["Basic Grid", "1 User", "Core Features"],
              cta: "Get Started"
            },
            {
              plan: "Pro",
              price: "$4.99/mo",
              features: ["Advanced Grid", "Custom Themes", "Analytics", "Priority Support"],
              cta: "Choose Pro"
            },
            {
              plan: "Team",
              price: "$8.99/mo",
              features: ["Team Collaboration", "Shared Grids", "Advanced Analytics", "24/7 Support"],
              cta: "Choose Team"
            }
          ].map((plan, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-center border border-gray-100 dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{plan.plan}</h3>
              <p className={`text-3xl font-bold text-black mb-4`}>{plan.price}</p>
              <ul className="text-gray-600 dark:text-gray-400 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2">{feature}</li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`px-6 py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section id="cta" className={`py-20 px-6 bg-gray-200 text-black`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Start Your Streak Today!
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl opacity-90 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of users who are turning their goals into habits. No credit card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/grid"
              className={`px-10 py-4 bg-gray-100 text-black text-xl font-bold rounded-xl shadow-lg hover:bg-gray-50 transition transform hover:scale-105`}
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">About</h3>
              <p className="text-sm">RoutineMelt helps you stay consistent with a beautiful contribution grid.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Links</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
              <div className="flex justify-center gap-4">
                <a href="https://www.linkedin.com/in/tushar-nailwal/" target="_blank" className="hover:text-white transition">LinkedIn</a>
                <a href="https://github.com/tusharathub" target="_blank" className="hover:text-white transition">GitHub</a>
              </div>
            </div>
          </div>
          <p className="text-sm">
            © {currentYear} RoutineMelt. Built with Next.js, Auth.js, and MongoDB.
          </p>
        </div>
      </footer>
    </main>
  );
}

// Custom component for clean feature blocks
interface FeatureCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => (
  <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 border border-gray-100 dark:border-gray-800">
    <Icon className={`w-8 h-8 mb-4 text-black dark:text-gray-800`} />
    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);