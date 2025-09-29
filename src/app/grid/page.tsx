"use client";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [values, setValues] = useState<{ date: string; count: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "/api/tasks?userId=123&from=2025-01-01&to=2025-12-31"
      );
      const data = await res.json();

      const grouped: Record<string, number> = {};
      data.forEach((task: any) => {
        grouped[task.date] = (grouped[task.date] || 0) + 1;
      });

      const allDates = generateDateArray("2025-01-01", "2025-12-31");
      const mergedValues = allDates.map((date) => ({
        date,
        count: grouped[date] || 0,
      }));

      setValues(mergedValues);
    }
    fetchData();
  }, []);

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

    const res = await fetch(`/api/tasks/${date}?userId=123`);
    const data = await res.json();
    console.log("Tasks for", date, data);
    setTasks(data);
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !newTask.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "123",
        title: newTask,
        date: selectedDate,
      }),
    });

    const res = await fetch(`/api/tasks/${selectedDate}?userId=123`);
    const data = await res.json();
    setTasks(data);
    setNewTask("");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Streak Tracker</h1>

      <CalendarHeatmap
        startDate={new Date("2025-01-01")}
        endDate={new Date("2025-12-31")}
        values={values}
        classForValue={(value) => {
          if (!value) return "color-empty";
          return `color-github-${Math.min(value.count, 4)}`;
        }}
        tooltipDataAttrs={(value) => ({
          "data-tip": `${value.date || ""} : ${value?.count || 0} tasks`,
        })}
        showWeekdayLabels
        onClick={(value) => value?.date && handleClick(value.date)}
      />

      {selectedDate && (
        <div className="mt-6 p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-2">
            Tasks for {selectedDate}
          </h2>

          <ul className="mb-4 list-disc list-inside">
            {tasks.length === 0 && (
              <li className="text-gray-500">No tasks yet</li>
            )}
            {tasks.map((task) => (
              <li key={task._id}>{task.title}</li>
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
