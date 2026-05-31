"use client";

import CalendarHeatmap, { ReactCalendarHeatmapValue } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState, useEffect, useMemo, SVGAttributes } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Calendar, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/app/lib/useTheme";

type Task = { _id?: string; title: string; createdAt: string };
type DayDoc = { date: string; tasks: Task[] };
type HeatMapValue = ReactCalendarHeatmapValue<string>;

export default function Home() {
  const { user, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  const [values, setValues] = useState<HeatMapValue[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  // start/end dates (past 11 months, next 1 month)
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();

    const start = new Date(today);
    start.setMonth(start.getMonth() - 11); // 11 months before

    const end = new Date(today);
    end.setMonth(end.getMonth() + 1); // 1 month after

    return {
      startDate: start,
      endDate: end,
    };
  }, []);

  // Calculate stats dynamically
  const totalLogs = useMemo(() => {
    return values.reduce((sum, v) => sum + (v.count || 0), 0);
  }, [values]);

  const activeDays = useMemo(() => {
    return values.filter(v => v.count > 0).length;
  }, [values]);

  // Load heatmap data
  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function fetchData() {
      try {
        const from = startDate.toISOString().split("T")[0];
        const to = endDate.toISOString().split("T")[0];

        if(!user) throw new Error("User not found");
        const res = await fetch(
          `/api/tasks?userId=${user.id}&from=${from}&to=${to}`
        );
        if (!res.ok) throw new Error(`Failed to fetch tasks ${res.status}`);
        const docs: DayDoc[] = await res.json();

        // Map into heatmap values
        const grouped: Record<string, number> = {};
        docs.forEach((doc) => {
          grouped[doc.date] = doc.tasks.length;
        });

        const allDates = generateDateArray(from, to);
        const mergedValues = allDates.map((date) => ({
          date,
          count: grouped[date] || 0,
        }));

        setValues(mergedValues);
      } catch (err) {
        console.log("error in fetching heatMap data :", err);
        setError("Failed to load tasks");
      }
    }
    fetchData();
  }, [isSignedIn, user, startDate, endDate]);

  function generateDateArray(start: string, end: string) {
    const arr: string[] = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      arr.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return arr;
  }

  async function handleClick(date: string) {
    setSelectedDate(date);
    if (!user) return;

    try {
      const res = await fetch(
        `/api/tasks?userId=${user.id}&from=${date}&to=${date}`
      );
      if (!res.ok)
        throw new Error(`Failed to fetch tasks of the day : ${res.status}`);
      const docs: DayDoc[] = await res.json();
      setSelectedTasks(docs[0]?.tasks || []);
    } catch (err) {
      console.error("Error in fetching tasks for the date :", err);
      setError("Failed to load tasks for the selected date");
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !newTask.trim() || !user) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: newTask,
          date: selectedDate,
        }),
      });
      if (!res.ok) throw new Error(`Failed to add task : ${res.status}`);
      const { task } = await res.json();

      // Refresh tasks for the selected day
      setSelectedTasks((prev) => [...prev, task]);

      // Also refresh heatmap counts
      setValues((prev) =>
        prev.map((v) =>
          v.date === selectedDate ? { ...v, count: v.count + 1 } : v
        )
      );
      setNewTask("");
    } catch (err) {
      console.log("error in adding task:", err);
      setError("Failed to add task, try again maybe");
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!user || !selectedDate) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          userId: user.id,
          date: selectedDate,
        }),
      });
      if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);

      // Refresh tasks for the selected day
      const taskRes = await fetch(
        `/api/tasks?userId=${user.id}&from=${selectedDate}&to=${selectedDate}`
      );
      if (!taskRes.ok)
        throw new Error(`Failed to refresh tasks: ${taskRes.status}`);
      const docs: DayDoc[] = await taskRes.json();
      setSelectedTasks(docs[0]?.tasks || []);

      // Update heatmap for the selected date
      setValues((prev) =>
        prev.map((v) =>
          v.date === selectedDate
            ? { ...v, count: docs[0]?.tasks.length || 0 }
            : v
        )
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    }
  }

  // Unauthorized display - themed to match sand & red editorial
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-theme-bg text-theme-fg p-6">
        <motion.div
          className="max-w-md w-full bg-theme-fg/5 p-8 border border-theme-primary rounded text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-3xl font-black tracking-tight text-theme-primary mb-2 select-none">
            RM.SECURE
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-theme-fg mb-4">
            Authorization Required
          </h2>
          <p className="text-xs uppercase font-semibold text-theme-fg/70 leading-relaxed mb-8">
            Access to the Streak Grid and task builder databases requires a validated credentials sign-in token.
          </p>

          <SignInButton mode="modal">
            <button
              className="w-full py-4 bg-theme-primary text-theme-bg text-sm font-black uppercase tracking-wider hover:opacity-90 transition cursor-pointer"
            >
              Sign In to Your Workspace
            </button>
          </SignInButton>

          <Link href="/" className="inline-flex items-center gap-1 text-xs uppercase font-bold text-theme-primary hover:underline mt-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Website
          </Link>

          {/* Abstract watermark */}
          <div className="absolute -right-6 -bottom-10 text-[10vw] font-black text-theme-primary/5 select-none pointer-events-none">
            --
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Link href="/" className="text-xs sm:text-sm font-semibold tracking-tight uppercase hover:text-theme-primary transition">
              Home
            </Link>
            
            {/* User profile dropdown & Theme switcher */}
            <div className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-4 border-l border-theme-fg/10">
              {/* Typographic Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "sand" : "dark")}
                className="flex items-center gap-1 px-2 py-1 border border-theme-fg/20 hover:border-theme-primary transition rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider cursor-pointer select-none"
              >
                <span>Theme /</span>
                <span className="text-theme-primary">{theme === "dark" ? "Dark" : "Light"}</span>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Title */}
      <section className="w-full px-6 pt-12 md:pt-16 pb-6 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-[10vw] md:text-[12vw] font-black leading-none tracking-tighter text-theme-primary select-none w-full uppercase">
              Streaks.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Red Divider & Info Grid */}
      <div className="w-full border-t border-theme-primary">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-semibold tracking-tight uppercase">
          <div className="text-theme-primary text-sm font-black">
            Your WORKSPACE
          </div>
          <div>
            <span className="text-theme-primary block mb-2 font-bold">Active User</span>
            <span className="normal-case font-normal text-theme-fg/80 leading-relaxed text-sm break-all">
              {user?.primaryEmailAddress?.emailAddress || user?.username || "Authenticated"}
            </span>
          </div>
          <div>
            <span className="text-theme-primary block mb-2 font-bold font-black">Total Logged Tasks</span>
            <div className="text-xl font-black text-theme-primary">
              {totalLogs} Tasks ({activeDays} Days Active)
            </div>
          </div>
          <div>
            <span className="text-theme-primary block mb-2 font-bold font-black">Date Range</span>
            <span className="opacity-80 font-normal">
              {startDate.toISOString().split("T")[0]} to {endDate.toISOString().split("T")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Calendar Section */}
      <section className="w-full px-6 py-12 border-t border-theme-primary/30">
        <div className="max-w-7xl mx-auto">
          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-theme-primary/10 text-theme-primary border border-theme-primary text-xs uppercase font-bold tracking-tight rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </motion.div>
          )}

          {/* Heatmap Layout */}
          <motion.div
            className="bg-theme-fg/5 p-6 md:p-8 rounded border border-theme-primary/30 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-theme-primary">
                Annual Streak Visualization (Click on cells to inspect)
              </span>
              <span className="text-xs uppercase font-semibold text-theme-fg/50">
                Red-Scale Heat Engine
              </span>
            </div>

            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
              <div className="min-w-[760px]">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={values}
                  classForValue={(value?: HeatMapValue) => {
                    if (!value || !value.count) return "color-empty";
                    return `color-github-${Math.min(value.count, 10)}`;
                  }}
                  tooltipDataAttrs={(value?: HeatMapValue) => ({
                    "data-tip": `${value?.date || ""}: ${value?.count || 0} tasks`
                  } as SVGAttributes<SVGGElement>)}
                  showWeekdayLabels
                  onClick={(value?: HeatMapValue) =>
                    value?.date && handleClick(value.date)
                  }
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Task Logger Modal / Detail View */}
      {selectedDate && (
        <section className="w-full px-6 py-12 border-t border-theme-primary bg-theme-fg/5">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-8 border-b border-theme-primary/30 pb-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-theme-fg flex items-center gap-2">
                  <Calendar className="w-5.5 h-5.5 text-theme-primary" />
                  Day Log / {selectedDate}
                </h2>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-xs font-bold uppercase border border-theme-fg/30 hover:border-theme-primary hover:bg-theme-primary/10 transition px-3 py-1 cursor-pointer"
                >
                  Close Day
                </button>
              </div>

              {/* Tasks List */}
              <ul className="mb-8 space-y-3">
                {selectedTasks.length === 0 && (
                  <li className="text-xs uppercase font-semibold text-theme-fg/40 py-6 text-center border border-dashed border-theme-fg/20 rounded">
                    Zero tasks completed on this day. Use the builder below to log routine metrics.
                  </li>
                )}
                {selectedTasks.map((task, i) => (
                  <motion.li
                    key={task._id || i}
                    className="flex justify-between items-center p-4 bg-theme-bg border border-theme-primary/20 hover:border-theme-primary/65 transition rounded duration-250"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <span className="text-sm font-semibold text-theme-fg uppercase tracking-tight">{task.title}</span>
                    <button
                      onClick={() => task._id && handleDeleteTask(task._id)}
                      className={`flex items-center gap-1.5 text-theme-primary hover:opacity-80 text-xs font-black uppercase transition tracking-wider cursor-pointer ${
                        !task._id ? "opacity-30 cursor-not-allowed" : ""
                      }`}
                      disabled={!task._id}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Task Add Form */}
              <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Insert routine accomplishment description..."
                  className="w-full sm:flex-1 border-b border-theme-fg/30 bg-transparent text-theme-fg focus:border-theme-primary outline-none py-2 text-sm uppercase tracking-tight font-semibold transition"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-theme-primary text-theme-bg text-xs font-black uppercase tracking-widest hover:opacity-90 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full bg-theme-bg border-t border-theme-primary py-12 px-6 text-xs font-semibold tracking-tight uppercase mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-theme-fg/50">
          <div>
            © {currentYear} RoutineMelt. Secured Workspace Environment.
          </div>
        </div>
      </footer>
    </main>
  );
}