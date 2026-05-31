"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Zap, Activity, Calendar, Trophy, ArrowUpRight, Sparkles, RefreshCw } from "lucide-react";
import { useTheme } from "@/app/lib/useTheme";

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  // Interactive Grid Simulator state
  const rows = 7;
  const cols = 28;
  const totalCells = rows * cols;
  
  // Create a cool default wave/pixel pattern for the grid
  const initialGrid = Array.from({ length: totalCells }, (_, index) => {
    const r = index % rows;
    const c = Math.floor(index / rows);
    // Draw a wave pattern + random spots
    const waveValue = Math.sin(c * 0.5) * 2 + 3;
    const isWave = Math.abs(r - waveValue) < 1;
    return isWave || (index % 11 === 0 && c % 3 === 0);
  });

  const [simulatorGrid, setSimulatorGrid] = useState<boolean[]>(initialGrid);

  // Stats calculation
  const totalActive = simulatorGrid.filter(Boolean).length;
  const consistencyRate = Math.round((totalActive / totalCells) * 100);
  
  // Calculate longest streak in terms of consecutive active columns
  const currentStreak = (() => {
    let maxColStreak = 0;
    let currentColStreak = 0;
    for (let c = 0; c < cols; c++) {
      let colHasActive = false;
      for (let r = 0; r < rows; r++) {
        if (simulatorGrid[c * rows + r]) {
          colHasActive = true;
          break;
        }
      }
      if (colHasActive) {
        currentColStreak++;
        if (currentColStreak > maxColStreak) maxColStreak = currentColStreak;
      } else {
        currentColStreak = 0;
      }
    }
    return maxColStreak;
  })();

  const toggleCell = (index: number) => {
    setSimulatorGrid((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const randomizeGrid = () => {
    setSimulatorGrid(Array.from({ length: totalCells }, () => Math.random() > 0.4));
  };

  const clearGrid = () => {
    setSimulatorGrid(Array.from({ length: totalCells }, () => false));
  };

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col transition-colors duration-300 bg-theme-bg text-theme-fg border-theme-primary">
      {/* Header/Nav */}
      <header className="sticky top-0 z-50 bg-theme-bg/95 backdrop-blur-sm border-b border-theme-primary/30 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="font-black text-theme-primary text-xl sm:text-2xl md:text-3xl hover:opacity-85 transition select-none tracking-tighter">
            <span className="sm:hidden">RM</span>
            <span className="hidden sm:inline">ROUTINEMELT</span>
          </Link>
          
          <nav className="flex items-center gap-3 sm:gap-6">
            <a href="#features" className="hidden md:inline text-xs sm:text-sm font-semibold tracking-tight uppercase hover:text-theme-primary transition">Method</a>
            <a href="#pricing" className="hidden md:inline text-xs sm:text-sm font-semibold tracking-tight uppercase hover:text-theme-primary transition">Pricing</a>
            {isSignedIn ? (
              <Link href="/grid" className="text-xs sm:text-sm font-bold tracking-tight uppercase border-b-2 border-theme-primary hover:opacity-80 transition pb-0.5">
                Dashboard
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="text-xs sm:text-sm font-bold tracking-tight uppercase border-b-2 border-theme-primary hover:opacity-80 transition pb-0.5 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            )}

            {/* Typographic Theme Toggle */}
            <div className="pl-3 sm:pl-4 border-l border-theme-fg/10">
              <button
                onClick={() => setTheme(theme === "dark" ? "sand" : "dark")}
                className="flex items-center gap-1 px-2 py-1 border border-theme-fg/20 hover:border-theme-primary transition rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider cursor-pointer select-none"
              >
                <span>Theme /</span>
                <span className="text-theme-primary">{theme === "dark" ? "Dark" : "Light"}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 pt-12 md:pt-16 pb-6 text-center">
        <div className="max-w-7xl mx-auto">
          {/* Big Editorial Logo Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-[10vw] md:text-[12vw] font-black leading-none tracking-tighter text-theme-primary select-none w-full">
              ROUTINEMELT.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Red Divider & Info Grid */}
      <div className="w-full border-t border-theme-primary bg-theme-bg">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-theme-primary/30 text-xs font-semibold tracking-tight uppercase">
          {/* Column 1: PSYCHOLOGY */}
          <div className="pb-6 md:pb-0 md:pr-10">
            <span className="text-theme-primary block mb-3 font-bold tracking-wider">01 // THE PSYCHOLOGY</span>
            <p className="normal-case font-normal text-theme-fg/90 leading-relaxed text-sm max-w-md">
              Consistency beats intensity. RoutineMelt focuses on visual momentum and showing you that progress isn&apos;t about perfect days, but about never breaking the chain.
            </p>
          </div>

          {/* Column 2: DATA INTEGRITY */}
          <div className="py-6 md:py-0 md:px-10">
            <span className="text-theme-primary block mb-3 font-bold tracking-wider">02 // DATA INTEGRITY</span>
            <p className="normal-case font-normal text-theme-fg/90 leading-relaxed text-sm max-w-md">
              Private database storage, zero tracking scripts, and secure authentication. Your daily habits are personal, and our architecture respects that absolute privacy.
            </p>
          </div>

          {/* Column 3: METADATA & SPECS */}
          <div className="pt-6 md:pt-0 md:pl-10 flex flex-col justify-between h-full">
            <div>
              <span className="text-theme-primary block mb-3 font-bold tracking-wider">03 // ARCHITECTURE SPEC</span>
              <span className="opacity-80 font-normal">Next.js 15 / Clerk / Tailwind v4</span>
            </div>
            <div className="mt-6 text-theme-primary font-black text-sm tracking-widest">
              © {currentYear} RM.STUDIO
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulator Section */}
      <section className="w-full px-6 py-12 border-t border-theme-primary/30 bg-theme-fg/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-theme-fg">
                <Sparkles className="w-5 h-5 text-theme-primary" />
                Try It: Daily Streak Simulator
              </h2>
              <p className="text-xs text-theme-fg/60 mt-1 uppercase font-semibold">
                Click or tap the squares to toggle your daily logs and build consistency.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={randomizeGrid} 
                className="px-3 py-1 text-xs font-bold uppercase border border-theme-fg/30 hover:border-theme-primary hover:bg-theme-primary/10 transition rounded flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Randomize
              </button>
              <button 
                onClick={clearGrid} 
                className="px-3 py-1 text-xs font-bold uppercase border border-theme-fg/30 hover:border-theme-primary hover:bg-theme-primary/10 transition rounded cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="bg-theme-bg p-6 rounded-lg border border-theme-primary/30 shadow-sm relative overflow-hidden">
            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
              <div 
                className="grid gap-1.5 select-none min-w-[650px]"
                style={{
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gridAutoFlow: "column"
                }}
              >
                {simulatorGrid.map((isActive, index) => (
                  <div
                    key={index}
                    onClick={() => toggleCell(index)}
                    className={`aspect-square w-full rounded-[2px] transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? "bg-theme-primary hover:opacity-85 shadow-[0_0_8px_rgba(255,8,0,0.2)]" 
                        : "bg-theme-fg/10 hover:bg-theme-fg/20"
                    }`}
                    title={`Log day ${Math.floor(index / rows) + 1}, row ${index % rows + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Sim Stats */}
            <div className="grid grid-cols-3 border-t border-theme-primary/30 mt-6 pt-4 text-center">
              <div>
                <span className="block text-xs uppercase tracking-wider text-theme-fg/50 font-bold">Total Logs</span>
                <span className="text-2xl font-black text-theme-primary">{totalActive}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-theme-fg/50 font-bold">Consistency</span>
                <span className="text-2xl font-black text-theme-primary">{consistencyRate}%</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-theme-fg/50 font-bold">Current Streak</span>
                <span className="text-2xl font-black text-theme-primary">{currentStreak} Weeks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Editorial Layout */}
      <section id="features" className="w-full border-t border-theme-primary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 border-b border-theme-primary">
          {/* Feature 1 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-theme-primary/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">01 / CALENDAR VIEW</span>
                <Calendar className="w-6 h-6 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-theme-fg">
                The Streak Grid
              </h3>
              <p className="text-theme-fg/80 leading-relaxed font-normal">
                A minimalist, annual calendar view that instantly highlights your daily consistency. Watch the patterns flow as you maintain a regular commit history for your habits.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-theme-fg/10 text-xs font-bold uppercase text-theme-primary">
              Minimalist Grid Engine
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">02 / HABIT DRILLDOWN</span>
                <Activity className="w-6 h-6 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-theme-fg">
                Micro logs
              </h3>
              <p className="text-theme-fg/80 leading-relaxed font-normal">
                Click any cell in the grid to log specific tasks, delete accomplishments, or review what you did on that day. Zero bloated details.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-theme-fg/10 text-xs font-bold uppercase text-theme-primary">
              Task CRUD Mechanics
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 border-b border-theme-primary">
          {/* Feature 3 */}
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-theme-primary/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">03 / INSPIRATIONAL STREAKS</span>
                <Trophy className="w-6 h-6 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-theme-fg">
                Gamification
              </h3>
              <p className="text-theme-fg/80 leading-relaxed font-normal">
                Earn streaks by filling columns and maintaining continuous weekly routines. Keeping the chain unbroken becomes as satisfying as writing code.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-theme-fg/10 text-xs font-bold uppercase text-theme-primary">
              Streaks & Achievements
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">04 / THE STACK SPEC</span>
                <Zap className="w-6 h-6 text-theme-primary" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4 text-theme-fg">
                Fast & Stable
              </h3>
              <p className="text-theme-fg/80 leading-relaxed font-normal">
                Powered by Next.js and MongoDB. Fast server-side rendering combined with Clerk authentication guarantees that your routines are loaded instantly and safely.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-theme-fg/10 text-xs font-bold uppercase text-theme-primary">
              Next.js 15 & Clerk Security
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Quote */}
      <section className="w-full py-20 px-6 bg-theme-fg/5 text-center border-b border-theme-primary">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-theme-primary">
            COMMUNITY PROOF
          </span>
          <blockquote className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight mt-6 mb-8 text-theme-fg select-none">
            &ldquo;The simplest, most effective habit tracker I&apos;ve ever used. Redesigning it makes me want to log tasks every hour.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <span className="w-10 h-10 rounded-full bg-theme-primary text-theme-bg flex items-center justify-center font-bold text-sm">
              CM
            </span>
            <div className="text-left">
              <p className="text-sm font-bold uppercase text-theme-fg">Carl MacLanen</p>
              <p className="text-xs text-theme-fg/60 uppercase font-semibold">Creator & Consistency Builder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Plan Statement */}
      <section id="pricing" className="w-full py-20 px-6 border-b border-theme-primary bg-theme-bg">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
            03 // PRICING AND ACCESSIBILITY
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mt-6 mb-8 text-theme-fg">
            FOREVER FREE.
          </h2>
          <p className="text-sm uppercase tracking-tight font-semibold max-w-xl mx-auto text-theme-fg/80 leading-relaxed mb-8">
            RoutineMelt is built on the belief that simple self-improvement tools should be accessible to everyone. There are no pricing tiers, paywalls, or hidden tracking scripts. Keep your streak alive without barriers.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/grid"
              className="px-8 py-4 bg-theme-primary text-theme-bg text-xs font-black uppercase tracking-wider hover:opacity-90 transition cursor-pointer"
            >
              CREATE YOUR STREAK BOARD
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Banner (Inverted High Contrast) */}
      <section className="w-full bg-theme-primary text-theme-bg py-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
            START YOUR STREAK TODAY.
          </h2>
          <p className="text-md uppercase tracking-tight font-semibold opacity-90 mb-10 max-w-xl mx-auto">
            Join developers, designers, and creators who are building consistent routines. Sand & Red styling. Absolute focus.
          </p>
          <Link 
            href="/grid"
            className="inline-flex items-center gap-2 px-10 py-5 bg-theme-bg text-theme-fg text-lg font-black uppercase tracking-wider hover:opacity-90 transition transform hover:scale-105 shadow-xl cursor-pointer"
          >
            START LOGGING NOW <ArrowUpRight className="w-5 h-5 text-theme-primary" />
          </Link>
        </div>
        
        {/* Abstract background logo watermark */}
        <div className="absolute right-0 bottom-0 text-[35vw] font-black leading-none select-none text-theme-bg/10 translate-x-20 translate-y-36 tracking-tighter pointer-events-none">
          ---
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-theme-bg border-t border-theme-primary py-16 px-6 text-xs font-semibold tracking-tight uppercase">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-theme-primary mb-4 font-black">RoutineMelt</h4>
            <p className="normal-case font-normal text-theme-fg/70 leading-relaxed text-sm">
              Helping you melt away bad habits and construct unstoppable routines. Built on standard grid architectures.
            </p>
          </div>
          <div>
            <h4 className="text-theme-primary mb-4 font-black">Navigation</h4>
            <ul className="space-y-2.5">
              <li><Link href="/grid" className="hover:text-theme-primary">Go to Dashboard</Link></li>
              <li><a href="#features" className="hover:text-theme-primary">Our Method</a></li>
              <li><a href="#pricing" className="hover:text-theme-primary">Pricing Table</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-theme-primary mb-4 font-black">Legal & Support</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="hover:text-theme-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-theme-primary">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-theme-primary">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-theme-primary mb-4 font-black">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://github.com/tusharathub" target="_blank" className="hover:text-theme-primary underline">GitHub</a>
              <a href="https://www.linkedin.com/in/tushar-nailwal/" target="_blank" className="hover:text-theme-primary underline">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-theme-fg/10 flex flex-col md:flex-row justify-between items-center gap-4 text-theme-fg/50 font-normal">
          <div>
            © {currentYear} RoutineMelt. Built with Next.js, Clerk, and MongoDB.
          </div>
        </div>
      </footer>
    </main>
  );
}
