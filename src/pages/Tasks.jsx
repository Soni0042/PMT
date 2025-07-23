import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Available task statuses
const STATUS_OPTIONS = [
  "Open",
  "In Progress",
  "Blocked",
  "Completed"
];

export default function Tasks() {
  const [projects] = useLocalStorage("pm_projects", []);
  const [tasks, setTasks] = useLocalStorage("pm_tasks", []);
  const [selectedProject, setSelectedProject] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", estimated: "", actual: "", status: "Open"
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskForm, setEditTaskForm] = useState({});
  const [filter, setFilter] = useState({ status: "All", search: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (projects.length > 0) setSelectedProject(projects[0].id);
  }, [projects]);

  // --- Task CRUD ----

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Task title is required");
    if (Number(form.estimated) < 0 || Number(form.actual) < 0)
      return setError("Hours cannot be negative");
    const newTask = {
      id: Date.now().toString(),
      projectId: selectedProject,
      title: form.title.trim(),
      description: form.description.trim(),
      estimated: Number(form.estimated) || 0,
      actual: Number(form.actual) || 0,
      status: form.status || "Open",
      subTasks: [],
      created: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setForm({ title: "", description: "", estimated: "", actual: "", status: "Open" });
    setError("");
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditTaskForm({
      title: task.title,
      description: task.description,
      estimated: task.estimated,
      actual: task.actual,
      status: task.status
    });
    setError("");
  };

  const handleSaveTaskEdit = (taskId) => {
    if (!editTaskForm.title.trim()) return setError("Task title is required");
    if (Number(editTaskForm.estimated) < 0 || Number(editTaskForm.actual) < 0)
      return setError("Hours cannot be negative");
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: editTaskForm.title.trim(),
              description: editTaskForm.description.trim(),
              estimated: Number(editTaskForm.estimated) || 0,
              actual: Number(editTaskForm.actual) || 0,
              status: editTaskForm.status
            }
          : task
      )
    );
    setEditingTaskId(null);
    setError("");
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Delete this task?")) setTasks(tasks.filter((task) => task.id !== id));
  };

  // --- Filtering and Search ---
  function filterTasks(list) {
    return list
      .filter(t => t.projectId === selectedProject)
      .filter(t => filter.status === "All" || t.status === filter.status)
      .filter(t => t.title.toLowerCase().includes(filter.search.toLowerCase()) || (t.description?.toLowerCase() || "").includes(filter.search.toLowerCase()));
  }
  const filteredTasks = filterTasks(tasks);

  // --- Sub-task state ---
  const [editingSubtask, setEditingSubtask] = useState({ tId: null, stId: null });
  const [editSubtaskForm, setEditSubtaskForm] = useState({});

  // ---- Component Render ----
  return (
    <div>
      <h2 className="font-bold text-2xl mb-7 text-left">Task Tracking</h2>
      {/* Project Selector */}
      <label className="block mb-3 font-semibold text-indigo-900">
        Select Project:&nbsp;
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name}</option>
          ))}
        </select>
      </label>

      {/* Status Filter and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center gap-2 font-medium">
          Status:
          <select
            value={filter.status}
            onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            className="border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="All">All</option>
            {STATUS_OPTIONS.map(s => <option value={s} key={s}>{s}</option>)}
          </select>
        </label>
        <input
          type="search"
          placeholder="Search tasks"
          value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          className="border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="mb-8 bg-indigo-50 rounded-lg shadow px-6 py-4 flex flex-wrap gap-4 items-end">
        <input
          required
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="number"
          placeholder="Est. Hrs"
          value={form.estimated}
          min="0"
          onChange={e => setForm({ ...form, estimated: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="number"
          placeholder="Actual Hrs"
          value={form.actual}
          min="0"
          onChange={e => setForm({ ...form, actual: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" className="bg-indigo-600 text-white font-bold px-5 py-2 rounded hover:bg-indigo-700 transition">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-6">
        {filteredTasks.length === 0 && <li>No tasks match.</li>}
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`border rounded-xl shadow px-5 py-4 bg-white relative ${editingTaskId === task.id ? "ring-2 ring-indigo-400" : ""}`}
          >
            {editingTaskId === task.id ? (
              <div className="flex flex-wrap gap-3 items-end">
                <input
                  required
                  type="text"
                  placeholder="Task Title"
                  value={editTaskForm.title}
                  onChange={e => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editTaskForm.description}
                  onChange={e => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <input
                  type="number"
                  placeholder="Est. Hrs"
                  value={editTaskForm.estimated}
                  min="0"
                  onChange={e => setEditTaskForm({ ...editTaskForm, estimated: e.target.value })}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <input
                  type="number"
                  placeholder="Actual Hrs"
                  value={editTaskForm.actual}
                  min="0"
                  onChange={e => setEditTaskForm({ ...editTaskForm, actual: e.target.value })}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <select
                  value={editTaskForm.status}
                  onChange={e => setEditTaskForm({ ...editTaskForm, status: e.target.value })}
                  className="border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => handleSaveTaskEdit(task.id)} className="bg-green-600 text-white font-bold px-5 py-2 rounded hover:bg-green-700 transition ml-1">
                  Save
                </button>
                <button type="button" onClick={() => setEditingTaskId(null)} className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300 font-bold transition ml-1">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 items-center">
                <strong className="text-lg">{task.title}</strong>
                <span className="px-2 py-1 ml-2 rounded bg-indigo-100 text-indigo-700 font-semibold uppercase text-xs">
                  {task.status}
                </span>
                <button className="ml-4 text-indigo-700 hover:underline text-sm" onClick={() => handleEditTask(task)}>
                  Edit
                </button>
                <button className="ml-2 text-red-500 hover:underline text-sm" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
                <span className="ml-auto text-gray-500 text-xs font-mono">
                  {task.estimated}h est, {task.actual}h actual
                </span>
              </div>
            )}
            <div className="mt-2 text-gray-700">{task.description || <em>No description</em>}</div>

            <SubTaskList
              subTasks={task.subTasks}
              onUpdateSubTasks={newSubs =>
                setTasks(tasks.map(t => t.id === task.id ? { ...t, subTasks: newSubs } : t))
              }
              editingSubtask={editingSubtask}
              setEditingSubtask={setEditingSubtask}
              editSubtaskForm={editSubtaskForm}
              setEditSubtaskForm={setEditSubtaskForm}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// SubTaskList with inline ADD and EDIT (add the className above to every input/select here as well!)
function SubTaskList({
  subTasks,
  onUpdateSubTasks,
  editingSubtask,
  setEditingSubtask,
  editSubtaskForm,
  setEditSubtaskForm
}) {
  const [stForm, setStForm] = useState({ title: "", estimated: "", actual: "" });
  const [error, setError] = useState("");

  // Add Subtask
  function handleAdd(e) {
    e.preventDefault();
    if (!stForm.title.trim()) return setError("Title required");
    if (Number(stForm.estimated) < 0 || Number(stForm.actual) < 0) return setError("Hours cannot be negative");
    onUpdateSubTasks([
      { ...stForm, id: Date.now().toString(), estimated: Number(stForm.estimated) || 0, actual: Number(stForm.actual) || 0 },
      ...subTasks
    ]);
    setStForm({ title: "", estimated: "", actual: "" });
    setError("");
  }
  function handleEditStart(st) {
    setEditingSubtask({ stId: st.id });
    setEditSubtaskForm({ title: st.title, estimated: st.estimated, actual: st.actual });
    setError("");
  }
  function handleEditSave(stId) {
    if (!editSubtaskForm.title.trim()) return setError("Title required");
    if (Number(editSubtaskForm.estimated) < 0 || Number(editSubtaskForm.actual) < 0) return setError("Hours cannot be negative");
    onUpdateSubTasks(subTasks.map(st => st.id === stId
      ? { ...st, ...editSubtaskForm, estimated: Number(editSubtaskForm.estimated) || 0, actual: Number(editSubtaskForm.actual) || 0 }
      : st
    ));
    setEditingSubtask({});
    setError("");
  }
  function handleDelete(stId) {
    onUpdateSubTasks(subTasks.filter(st => st.id !== stId));
  }

  return (
    <div className="ml-8">
      {error && <div className="text-red-600 font-medium mb-2">{error}</div>}
      <form onSubmit={handleAdd} className="my-2 flex flex-wrap gap-2 items-end">
        <input
          type="text"
          required
          placeholder="Subtask Title"
          value={stForm.title}
          onChange={e => setStForm({ ...stForm, title: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="number"
          placeholder="Est."
          min="0"
          value={stForm.estimated}
          onChange={e => setStForm({ ...stForm, estimated: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="number"
          placeholder="Act."
          min="0"
          value={stForm.actual}
          onChange={e => setStForm({ ...stForm, actual: e.target.value })}
          className="border border-gray-300 bg-white rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button type="submit" className="bg-indigo-500 text-white font-bold px-3 py-2 rounded hover:bg-indigo-600 transition">
          Add Subtask
        </button>
      </form>
      <ul className="space-y-2 mt-2">
        {subTasks.length === 0 && <li><em>No subtasks yet.</em></li>}
        {subTasks.map(st =>
          editingSubtask.stId === st.id ? (
            <li key={st.id} className="bg-indigo-50 rounded p-2 flex flex-wrap gap-2 items-center">
              <input
                required
                type="text"
                value={editSubtaskForm.title}
                onChange={e => setEditSubtaskForm(f => ({ ...f, title: e.target.value }))}
                className="border border-gray-300 bg-white rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <input
                type="number"
                min="0"
                value={editSubtaskForm.estimated}
                onChange={e => setEditSubtaskForm(f => ({ ...f, estimated: e.target.value }))}
                className="border border-gray-300 bg-white rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <input
                type="number"
                min="0"
                value={editSubtaskForm.actual}
                onChange={e => setEditSubtaskForm(f => ({ ...f, actual: e.target.value }))}
                className="border border-gray-300 bg-white rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button onClick={() => handleEditSave(st.id)} className="bg-green-600 text-white font-bold px-3 py-2 rounded hover:bg-green-700 transition">
                Save
              </button>
              <button type="button" className="bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300 font-bold transition" onClick={() => setEditingSubtask({})}>
                Cancel
              </button>
            </li>
          ) : (
            <li key={st.id} className="flex flex-wrap gap-2 items-center">
              {st.title} <span className="text-gray-500">({st.estimated}h est, {st.actual}h act)</span>
              <button className="ml-2 text-indigo-700 hover:underline text-sm" onClick={() => handleEditStart(st)}>Edit</button>
              <button className="ml-2 text-red-500 hover:underline text-sm" onClick={() => handleDelete(st.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

// Status color function (not used because we use background badges in the main card now)
function getStatusColor(status) {
  switch (status) {
    case "Open": return "#f1e3ff";
    case "In Progress": return "#d9fbe1";
    case "Blocked": return "#ffe8e8";
    case "Completed": return "#e0f5ff";
    default: return "#ededed";
  }
}
