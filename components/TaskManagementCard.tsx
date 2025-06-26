"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hook/useOutsideClick";
import { Check, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  moduleId: number;
}

interface TaskGroup {
  heading: string;
  tag: string;
  tasks: Task[];
}

export default function TaskManagementCards({
  taskGroups,
}: {
  taskGroups: TaskGroup[];
}) {
  const [active, setActive] = useState<TaskGroup | null>(null);
  // Initialize localTaskGroups with the prop, and update it when prop changes
  const [localTaskGroups, setLocalTaskGroups] =
    useState<TaskGroup[]>(taskGroups);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    setLocalTaskGroups(taskGroups); // Keep local state in sync with prop
  }, [taskGroups]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
        setEditingTask(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => {
    setActive(null);
    setEditingTask(null);
  });

  const calculateCompletionPercentage = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const toggleTaskCompletion = async (taskId: number, moduleId: number) => {
    const updatedGroups = localTaskGroups.map((group) => ({
      ...group,
      tasks: group.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));

    const updatedTask = updatedGroups
      .flatMap((group) => group.tasks)
      .find((task) => task.id === taskId);

    setLocalTaskGroups(updatedGroups);

    try {
      await fetch("/api/tasks/markTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          moduleId,
          completed: updatedTask?.completed,
        }),
      });
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }

    if (active) {
      setActive((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : null
      );
    }
  };

  const deleteTask = async (taskId: number, moduleId: number) => {
    setLocalTaskGroups((prev) =>
      prev.map((group) => ({
        ...group,
        tasks: group.tasks.filter((task) => task.id !== taskId),
      }))
    );

    try {
      await fetch("api/tasks/deleteTasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, moduleId }),
      });
    } catch (error) {
      console.error(error);
    }

    if (active) {
      setActive((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter((task) => task.id !== taskId),
            }
          : null
      );
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditValue(task.text);
  };

  const saveEdit = async (taskId: number, moduleId: number) => {
    if (editValue.trim()) {
      setLocalTaskGroups((prev) =>
        prev.map((group) => ({
          ...group,
          tasks: group.tasks.map((task) =>
            task.id === taskId ? { ...task, text: editValue.trim() } : task
          ),
        }))
      );

      try {
        await fetch("api/tasks/updateTasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId,
            taskText: editValue.trim(),
            moduleId,
          }),
        });
      } catch (error) {
        console.error(error);
      }

      if (active) {
        setActive((prev) =>
          prev
            ? {
                ...prev,
                tasks: prev.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, text: editValue.trim() }
                    : task
                ),
              }
            : null
        );
      }
    }
    setEditingTask(null);
    setEditValue("");
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`button-${active.heading}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 shadow-lg"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.heading}-${id}`}
              ref={ref}
              className="w-full max-w-2xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.heading}-${id}`}
                      className="text-2xl font-bold text-neutral-800 dark:text-neutral-200"
                    >
                      {active.heading}
                    </motion.h3>
                    <motion.div layoutId={`tag-${active.tag}-${id}`}>
                      <Badge variant="secondary" className="mt-2">
                        {active.tag}
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {active.tasks.filter((t) => t.completed).length} of{" "}
                    {active.tasks.length} completed
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${calculateCompletionPercentage(
                          active.tasks
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    {calculateCompletionPercentage(active.tasks)}%
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
                <div className="space-y-3">
                  {active.tasks.length > 0 ? (
                    active.tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -20,
                          transition: { duration: 0.2 },
                        }}
                        layout="position"
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <button
                          onClick={() =>
                            toggleTaskCompletion(task.id, task.moduleId)
                          }
                          className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                            task.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-green-400"
                          }`}
                        >
                          {task.completed && <Check className="h-3 w-3" />}
                        </button>

                        {editingTask === task.id ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => saveEdit(task.id, task.moduleId)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveEdit(task.id, task.moduleId);
                              if (e.key === "Escape") {
                                setEditingTask(null);
                                setEditValue("");
                              }
                            }}
                            className="flex-1 h-8"
                            autoFocus
                          />
                        ) : (
                          <span
                            className={`flex-1 ${
                              task.completed
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {task.text}
                          </span>
                        )}

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditing(task)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded"
                          >
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id, task.moduleId)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No tasks yet. Click &quot;Add Task&quot; to get started!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Main container for the cards themselves (the scrollable strip) */}
      {/* We need this to fill the parent's height (the black box) and manage its own scrolling */}
      <div className="h-full flex overflow-x-auto gap-6 p-4 hide-scrollbar">
        {" "}
        {/* Added h-full and removed individual card padding here */}
        {localTaskGroups.map((group) => (
          <motion.div
            layoutId={`card-${group.heading}-${id}`}
            key={`card-${group.heading}-${id}`}
            onClick={() => setActive(group)}
            // Adjusted width for consistency, flex-shrink-0 to ensure they don't shrink
            className="p-4 rounded-xl border-gray-50 border-r border-b cursor-pointer transition-all duration-200 flex-shrink-0 w-[300px] h-[calc(100%-1rem)] relative" // Added h-[calc(100%-1rem)] for height and relative positioning
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <motion.h3
                  layoutId={`title-${group.heading}-${id}`}
                  className="text-2xl font-semibold text-gray-50 mb-2"
                >
                  {group.heading}
                </motion.h3>

                <motion.div
                  layoutId={`tag-${group.tag}-${id}`}
                  className="mb-4"
                >
                  <Badge variant="secondary">{group.tag}</Badge>
                </motion.div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-50 mb-1">
                  {calculateCompletionPercentage(group.tasks)}%
                </div>
                <div className="text-sm font-bold text-neutral-50">
                  Complete
                </div>
              </div>
            </div>
            <div className="text-sm text-neutral-100 mt-4 absolute bottom-4 left-4 right-4">
              {" "}
              {/* Position this at the bottom */}
              {group.tasks.filter((t) => t.completed).length} of{" "}
              {group.tasks.length} tasks completed
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
