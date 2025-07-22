import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  "Open",
  "WIP",
  "Under Development",
  "Internal UAT",
  "Completed"
];

function ProjectForm({ onSubmit, initial }) {
  const [form, setForm] = useState(
    initial || { id: null, name: "", description: "", department: "", durationStart: "", durationEnd: "", sponsor: "", status: "Open" }
  );
  useEffect(() => {
    setForm(initial || { id: null, name: "", description: "", department: "", durationStart: "", durationEnd: "", sponsor: "", status: "Open" });
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim()) {
      alert("Project name and department are required.");
      return;
    }
    onSubmit({ ...form, id: form.id || Date.now().toString() });
    setForm({ id: null, name: "", description: "", department: "", durationStart: "", durationEnd: "", sponsor: "", status: "Open" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-4 flex flex-wrap gap-4 items-end mb-6 max-w-2xl"
    >
      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={form.name}
        required
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 w-48"
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={form.department}
        required
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 w-40"
      />
      <input
        type="text"
        name="sponsor"
        placeholder="Sponsor"
        value={form.sponsor}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 w-36"
      />
      <input
        type="date"
        name="durationStart"
        value={form.durationStart}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 w-36"
      />
      <input
        type="date"
        name="durationEnd"
        value={form.durationEnd}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 w-36"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 w-44"
      >
        {STATUS_OPTIONS.map(s => (
          <option value={s} key={s}>{s}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-medium"
      >
        {form.id ? "Update" : "Add Project"}
      </button>
    </form>
  );
}

export default function Projects() {
  const [projects, setProjects] = useLocalStorage("pm_projects", []);
  const [editId, setEditId] = useState(null);

  const handleAddOrUpdate = (proj) => {
    if (editId) {
      setProjects(projects.map(p => p.id === editId ? proj : p));
      setEditId(null);
    } else {
      setProjects([proj, ...projects]);
    }
  };

  const handleEdit = (id) => setEditId(id);

  const handleDelete = (id) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const editingProject = projects.find(p => p.id === editId);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-5">Projects</h2>
      <ProjectForm onSubmit={handleAddOrUpdate} initial={editingProject}/>
      <ul className="space-y-4">
        {projects.length === 0 && <li>No projects yet.</li>}
        {projects.map((proj) => (
          <li
            key={proj.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 border-l-4 border-indigo-500"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{proj.name}</span>
              <span className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700">
                {proj.status}
              </span>
            </div>
            <div className="text-gray-600 text-sm">{proj.description}</div>
            <div className="gap-2 flex flex-wrap text-sm text-gray-400">
              <span>Department: {proj.department}</span>
              <span>Sponsor: {proj.sponsor || '-'}</span>
              <span>
                Duration: {proj.durationStart ? proj.durationStart : "?"} - {proj.durationEnd ? proj.durationEnd : "?"}
              </span>
            </div>
            <div className="flex gap-3 justify-end mt-1">
              <button
                className="text-indigo-600 hover:underline text-sm"
                onClick={() => handleEdit(proj.id)}
              >Edit</button>
              <button
                className="text-red-500 hover:underline text-sm"
                onClick={() => handleDelete(proj.id)}
              >Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
