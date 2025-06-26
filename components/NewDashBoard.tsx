"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import img from "../public/reading.png";
import Idea from "../public/meditating.png";

// Import the TaskManagementCards component
import TaskManagementCards from "./TaskManagementCard"; // Adjust the path as needed

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


const NewDashBoard = ({
  taskGroups: initialTaskGroups,
}: {
  taskGroups: TaskGroup[];
}) => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<
    { text: string; completed: boolean ; id:number }[]
  >([]);
  const [generatedModule, setGeneratedModule] = useState<TaskGroup | null>(
    null
  );

  const [displayTaskGroups, setDisplayTaskGroups] =
    useState<TaskGroup[]>(initialTaskGroups);

  useEffect(() => {
    setDisplayTaskGroups(initialTaskGroups);
  }, [initialTaskGroups]);

  const generateTasks = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: topic }),
      });

      const { moduleData } = await res.json();
      console.log(moduleData, "data");

      const processedModule: TaskGroup = {
        heading: moduleData.heading,
        tag: moduleData.tag,
        tasks: moduleData.tasks.map(
          (task: { text: string; completed: boolean; id: number }) => ({
            id: task.id, // Temporary client-side ID. Use a robust ID generation in production.
            text: task.text,
            completed: task.completed,
            moduleId:
              moduleData.moduleId || Math.floor(Math.random() * 1000) + 1, // Ensure moduleId exists
          })
        ),
      };

      setGeneratedTasks(processedModule.tasks);
      setGeneratedModule(processedModule);

      setDisplayTaskGroups((prev) => [...prev, processedModule]);
    } catch (error) {
      console.error("Error generating tasks:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTaskToDB = async () => {
    if (!generatedModule) {
      console.error("No module to save.");
      return;
    }

    try {
      const res = await fetch("/api/tasks/saveTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedModule),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to save task");
        console.error("Failed to save task:", errorData.message);
      } else {
        alert("Tasks saved successfully!");
        console.log("Tasks saved successfully!");
        setGeneratedTasks([]);
        setGeneratedModule(null);
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  return (
    <div className="w-full min-h-screen ">
      <div className="flex flex-col items-center justify-center p-5 space-y-10 ">
        {/* Left section: Task Generator */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl min-h-[25rem] p-10 rounded-[2.5rem] bg-gray-200 shadow-md">
          {/* Left Side */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            <div className="flex items-center gap-3 text-3xl font-bold">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span>Generate Tasks with AI</span>
            </div>
            <p className="text-gray-700 text-base md:text-xl ">
              Enter a topic and let our AI create a personalized task list for
              you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="e.g., Learn React, Plan vacation, Start fitness routine..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateTasks()}
                className="flex-1 bg-white border border-gray-300 text-black px-4 py-3 rounded-xl text-base"
              />
              <Button
                onClick={generateTasks}
                disabled={!topic.trim() || isGenerating}
                className="px-6 py-3 rounded-xl text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Tasks
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
            <Image
              src={img}
              alt="image"
              className="w-[540px] h-auto object-contain"
            />
          </div>
        </div>

        {/* Section below the generator */}
        <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10 w-full max-w-7xl">
          {/* Left half: Generated Tasks Display */}
          <div className="w-full md:w-1/2 min-h-[300px] bg-gradient-to-br from-[#fe7de9] to-[#edfe4d] rounded-4xl p-6 overflow-y-auto hide-scrollbar">
            <h2 className="text-black text-center font-bold text-2xl mb-4">
              GENERATED TASKS WILL APPEAR HERE
            </h2>
            {generatedTasks.length === 0 ? (
              <div className="flex justify-center">
                <Image width={510} src={Idea} alt="idea" />
              </div>
            ) : (
              <>
                <div className="space-y-3 text-base text-black">
                  {generatedTasks.map((task, i) => (
                    <div
                      key={task.id || `gen-task-${i}`}
                      className="text-black text-2xl px-4 py-3 flex-col gap-2  rounded-lg "
                    >
                      <h1>{task.text}</h1>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={saveTaskToDB}
                    className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-900"
                  >
                    Save All Tasks
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right half: Black box to show TaskManagementCards - now styled as a card */}
          <div className="w-full md:w-1/2 min-h-[300px] bg-black text-white rounded-4xl shadow-xl flex flex-col p-4">
            {" "}
            {/* Added flex flex-col, removed min-h, fixed height */}
            <h1 className="text-4xl font-bold mb-4 text-center">
              Your Task Modules
            </h1>{" "}
            {/* Added a proper title */}
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              {" "}
              {/* This div will take remaining height and handle horizontal scroll */}
              {displayTaskGroups.length > 0 ? (
                <TaskManagementCards taskGroups={displayTaskGroups} />
              ) : (
                <p className="text-gray-400 text-lg text-center flex-grow flex items-center justify-center">
                  {" "}
                  {/* Added flex-grow and centering */}
                  Your generated modules will appear as cards here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashBoard;
