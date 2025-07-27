import React, { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function DataManagement() {
  // Use localStorage hooks for projects, tasks, resources
  const [projects, setProjects] = useLocalStorage("pm_projects", []);
  const [tasks, setTasks] = useLocalStorage("pm_tasks", []);
  const [resources, setResources] = useLocalStorage("pm_resources", []);

  // Example functions to delete one item from each category:

  const deleteProject = (projectId) => {
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
  };

  const deleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
  };

  const deleteResource = (resourceId) => {
    const updated = resources.filter((r) => r.id !== resourceId);
    setResources(updated);
  };

  // Clear all data handler
  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear ALL project, task, and resource data?")) {
      localStorage.removeItem("pm_projects");
      localStorage.removeItem("pm_tasks");
      localStorage.removeItem("pm_resources");
      setProjects([]);
      setTasks([]);
      setResources([]);
    }
  };

  // Example effect to demonstrate syncing if needed
  // (Usually useLocalStorage handles this already)
  useEffect(() => {
    if (!localStorage.getItem("pm_projects")) setProjects([]);
    if (!localStorage.getItem("pm_tasks")) setTasks([]);
    if (!localStorage.getItem("pm_resources")) setResources([]);
  }, []); // Empty deps means it runs once on mount

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold mb-6">Project Management Data</h1>

      <button
        onClick={clearAllData}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Clear All Data
      </button>

      {/* Example Lists with Delete Buttons */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="italic">No projects yet.</p>
        ) : (
          <ul className="space-y-1">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-50 rounded p-2"
              >
                <span>{p.name || "(Unnamed Project)"}</span>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="italic">No tasks yet.</p>
        ) : (
          <ul className="space-y-1">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center bg-gray-50 rounded p-2"
              >
                <span>{t.name || "(Unnamed Task)"}</span>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Resources ({resources.length})</h2>
        {resources.length === 0 ? (
          <p className="italic">No resources yet.</p>
        ) : (
          <ul className="space-y-1">
            {resources.map((r) => (
              <li
                key={r.id}
                className="flex justify-between items-center bg-gray-50 rounded p-2"
              >
                <span>{r.name || "(Unnamed Resource)"}</span>
                <button
                  onClick={() => deleteResource(r.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
