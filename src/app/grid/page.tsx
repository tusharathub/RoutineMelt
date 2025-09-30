"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState, useEffect, useMemo } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

type Task = { _id?: string; title: string; createdAt: string };
type DayDoc = { date: string; tasks: Task[] };
type HeatMapValue = { date: string; count: number };

export default function Home() {
  const { user, isSignedIn } = useUser();

  const [values, setValues] = useState<HeatMapValue[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 🔹 Compute dynamic start/end dates (past 11 months, next 1 month)
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
        setError("failed to load tasks");
      }
    }
    fetchData();
  }, [isSignedIn, user, startDate, endDate]);

  function generateDateArray(start: string, end: string) {
    const arr: string[] = [];
    let current = new Date(start);
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
      <div className="flex items-center justify-center min-h-screen">
        <SignInButton mode="modal">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Sign In to see the progress
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Progress Builder</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value: HeatMapValue | null) => {
          if (!value) return "color-empty";
          return `color-github-${Math.min(value.count, 10)}`;
        }}
        tooltipDataAttrs={(value: HeatMapValue | null) => ({
          "data-tip": `${value?.date || ""} : ${value?.count || 0} tasks`,
        })}
        showWeekdayLabels
        onClick={(value: HeatMapValue | null) =>
          value?.date && handleClick(value.date)
        }
      />

      {selectedDate && (
        <div className="mt-6 p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">
            Tasks for {selectedDate}
          </h2>
          <ul className="mb-4 list-disc list-inside">
            {selectedTasks.length === 0 && (
              <li className="text-gray-500">No tasks yet</li>
            )}
            {selectedTasks.map((task, i) => (
              <li
                key={task._id || i}
                className="flex justify-between items-center"
              >
                <span>{task.title}</span>
                <button
                  onClick={() => task._id && handleDeleteTask(task._id)}
                  className={`text-red-500 hover:text-red-700 ${
                    !task._id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!task._id}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add new task..."
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
