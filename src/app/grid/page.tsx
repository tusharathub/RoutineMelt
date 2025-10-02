"use client";

import CalendarHeatmap, { ReactCalendarHeatmapValue } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState, useEffect, useMemo } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Calendar, Plus, Trash2 } from "lucide-react";

type Task = { _id?: string; title: string; createdAt: string };
type DayDoc = { date: string; tasks: Task[] };
// type HeatMapValue = { date: string; count: number };
type HeatMapValue = ReactCalendarHeatmapValue<string>;


export default function Home() {
  const { user, isSignedIn } = useUser();

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

  if (!isSignedIn) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SignInButton mode="modal">
          <button
            className={`flex items-center gap-2 px-6 py-3 text-black rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105`}
          >
            <Plus className="w-5 h-5" />
            Sign In to See Your Progress
          </button>
        </SignInButton>
      </motion.div>
    );
  }

  return (
    <div className="p-6 mt-20 md:p-8 max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={`text-3xl font-bold text-black flex items-center gap-2`}>
          <Calendar className={`w-8 h-8 text-black`} />
          Your Progress Builder
        </h1>
        <UserButton afterSignOutUrl="/" />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {error}
        </motion.div>
      )}

      {/* Calendar Heatmap */}
      <motion.div
        className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value?: HeatMapValue ) => {
            if (!value) return "color-empty";
            return `color-github-${Math.min(value.count, 10)}`;
          }}
          tooltipDataAttrs={(value): {[key: string]: string} => ({
          "data-tip": `${value?.date}: ${value?.count || 0} tasks`}) }
          showWeekdayLabels
          onClick={(value?: HeatMapValue ) =>
            value?.date && handleClick(value.date)
          }
        />
      </motion.div>

      {/* Task Section */}
      {selectedDate && (
        <motion.div
          className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className={`w-6 h-6 text-black`} />
            Tasks for {selectedDate}
          </h2>
          <ul className="mb-6 space-y-3">
            {selectedTasks.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">No tasks yet</li>
            )}
            {selectedTasks.map((task, i) => (
              <motion.li
                key={task._id || i}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className="text-gray-900 dark:text-white">{task.title}</span>
                <button
                  onClick={() => task._id && handleDeleteTask(task._id)}
                  className={`flex items-center gap-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ${
                    !task._id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!task._id}
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </motion.li>
            ))}
          </ul>

          {/* Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add new task..."
              className={`flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-100`}
            />
            <button
              type="submit"
              className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105`}
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}