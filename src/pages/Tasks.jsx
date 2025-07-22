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
      <h2>Task Tracking</h2>
      <label>
        Select Project:&nbsp;
        <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>{proj.name}</option>
          ))}
        </select>
      </label>
      <br /><br />
      <div style={{display: "flex", gap: 12, flexWrap:"wrap"}}>
        <label>
          Status:
          <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} style={{ marginLeft: 4 }}>
            <option value="All">All</option>
            {STATUS_OPTIONS.map(s => <option value={s} key={s}>{s}</option>)}
          </select>
        </label>
        <input
          type="search"
          placeholder="Search tasks"
          value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleAddTask} style={{ margin: "1rem 0", background: "#f7f7fa", padding: "0.7rem" }}>
        <input
          required
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Est. Hrs"
          value={form.estimated}
          min="0"
          onChange={e => setForm({ ...form, estimated: e.target.value })}
          style={{ width: "5rem", marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Actual Hrs"
          value={form.actual}
          min="0"
          onChange={e => setForm({ ...form, actual: e.target.value })}
          style={{ width: "5rem", marginRight: "0.5rem" }}
        />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" style={{ marginLeft: "0.5rem" }}>Add Task</button>
      </form>

      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {filteredTasks.length === 0 && <li>No tasks match.</li>}
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "1.3rem",
              padding: "0.7rem",
              background: editingTaskId === task.id ? "#f8f8f8" : "white"
            }}
          >
            {editingTaskId === task.id ? (
              <div>
                <input
                  required
                  type="text"
                  placeholder="Task Title"
                  value={editTaskForm.title}
                  onChange={e => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                  style={{ marginRight: "0.5rem" }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={editTaskForm.description}
                  onChange={e => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                  style={{ marginRight: "0.5rem" }}
                />
                <input
                  type="number"
                  placeholder="Est. Hrs"
                  value={editTaskForm.estimated}
                  min="0"
                  onChange={e => setEditTaskForm({ ...editTaskForm, estimated: e.target.value })}
                  style={{ width: "5rem", marginRight: "0.5rem" }}
                />
                <input
                  type="number"
                  placeholder="Actual Hrs"
                  value={editTaskForm.actual}
                  min="0"
                  onChange={e => setEditTaskForm({ ...editTaskForm, actual: e.target.value })}
                  style={{ width: "5rem", marginRight: "0.5rem" }}
                />
                <select value={editTaskForm.status} onChange={e => setEditTaskForm({ ...editTaskForm, status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => handleSaveTaskEdit(task.id)} style={{ marginLeft: "0.5rem" }}>Save</button>
                <button type="button" style={{ marginLeft: "0.5rem" }} onClick={() => setEditingTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong style={{ fontSize: "1.04rem" }}>{task.title}</strong>
                <span style={{
                  padding: "0.15em 0.55em",
                  marginLeft: "1em",
                  borderRadius: 8,
                  background: getStatusColor(task.status),
                  color: "#222",
                  fontWeight: "bold",
                  fontSize: "0.85em",
                  verticalAlign: "middle"
                }}>
                  {task.status}
                </span>
                <button style={{ marginLeft: "1rem" }} onClick={() => handleEditTask(task)}>
                  Edit
                </button>
                <button style={{ marginLeft: "0.5rem" }} onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
                <span style={{ float: "right", color: "#888", fontSize: "0.9em" }}>
                  {task.estimated}h est, {task.actual}h actual
                </span>
              </div>
            )}
            <div style={{ marginTop: "0.2em", marginBottom: "0.5em" }}>
              <span style={{ color: "#444" }}>{task.description || <em>No description</em>}</span>
            </div>

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

// SubTaskList with inline ADD and EDIT
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
    onUpdateSubTasks([{ ...stForm, id: Date.now().toString(), estimated: Number(stForm.estimated) || 0, actual: Number(stForm.actual) || 0 },
      ...subTasks
    ]);
    setStForm({ title: "", estimated: "", actual: "" });
    setError("");
  }
  // Begin edit
  function handleEditStart(st) {
    setEditingSubtask({ stId: st.id });
    setEditSubtaskForm({ title: st.title, estimated: st.estimated, actual: st.actual });
    setError("");
  }
  // Save edit
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
  // Delete subtask
  function handleDelete(stId) {
    onUpdateSubTasks(subTasks.filter(st => st.id !== stId));
  }

  return (
    <div style={{ marginLeft: "1.4rem" }}>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleAdd} style={{ marginTop: "0.5rem" }}>
        <input
          type="text"
          required
          placeholder="Subtask Title"
          value={stForm.title}
          onChange={e => setStForm({ ...stForm, title: e.target.value })}
          style={{ marginRight: "0.5rem", width: 120 }}
        />
        <input
          type="number"
          placeholder="Est."
          min="0"
          value={stForm.estimated}
          onChange={e => setStForm({ ...stForm, estimated: e.target.value })}
          style={{ width: "5rem", marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Act."
          min="0"
          value={stForm.actual}
          onChange={e => setStForm({ ...stForm, actual: e.target.value })}
          style={{ width: "5rem", marginRight: "0.5rem" }}
        />
        <button type="submit">Add Subtask</button>
      </form>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {subTasks.length === 0 && <li><em>No subtasks yet.</em></li>}
        {subTasks.map(st =>
          editingSubtask.stId === st.id ? (
            <li key={st.id} style={{ background: "#f0f0f0", marginTop: 4 }}>
              <input
                required
                type="text"
                value={editSubtaskForm.title}
                onChange={e => setEditSubtaskForm(f => ({ ...f, title: e.target.value }))}
                style={{ marginRight: "0.5rem", width: 120 }}
              />
              <input
                type="number"
                min="0"
                value={editSubtaskForm.estimated}
                onChange={e => setEditSubtaskForm(f => ({ ...f, estimated: e.target.value }))}
                style={{ width: "5rem", marginRight: "0.5rem" }}
              />
              <input
                type="number"
                min="0"
                value={editSubtaskForm.actual}
                onChange={e => setEditSubtaskForm(f => ({ ...f, actual: e.target.value }))}
                style={{ width: "5rem", marginRight: "0.5rem" }}
              />
              <button onClick={() => handleEditSave(st.id)}>Save</button>
              <button type="button" style={{ marginLeft: 4 }} onClick={() => setEditingSubtask({})}>Cancel</button>
            </li>
          ) : (
            <li key={st.id} style={{ marginTop: 4 }}>
              {st.title} <span style={{ color: "#888" }}>({st.estimated}h est, {st.actual}h act)</span>
              <button style={{ marginLeft: "1rem" }} onClick={() => handleEditStart(st)}>Edit</button>
              <button style={{ marginLeft: "0.5rem" }} onClick={() => handleDelete(st.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

// Status color (for minimal highlight)
function getStatusColor(status) {
  switch (status) {
    case "Open": return "#f1e3ff";
    case "In Progress": return "#d9fbe1";
    case "Blocked": return "#ffe8e8";
    case "Completed": return "#e0f5ff";
    default: return "#ededed";
  }
}
