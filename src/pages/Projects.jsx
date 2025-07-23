import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";
import ProjectForm from '../components/ProjectForm'; // <--- Only this, NOT the old function

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
      <ProjectForm onAddProject={handleAddOrUpdate} initial={editingProject}/>
      <ul className="space-y-4">
        {projects.length === 0 && <li>No projects yet.</li>}
        {projects.map((proj) => (
          <li key={proj.id} className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 border-l-4 border-indigo-500">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{proj.name}</span>
              <span className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700">{proj.status}</span>
            </div>
            <div className="text-gray-600 text-sm">{proj.description}</div>
            <div className="gap-2 flex flex-wrap text-sm text-gray-400">
              <span>Department: {proj.department}</span>
              <span>Sponsor: {proj.sponsor || '-'}</span>
              <span>Duration: {proj.durationStart ? proj.durationStart : "?"} - {proj.durationEnd ? proj.durationEnd : "?"}</span>
            </div>
            <div className="flex gap-3 justify-end mt-1">
              <button className="text-indigo-600 hover:underline text-sm" onClick={() => handleEdit(proj.id)}>Edit</button>
              <button className="text-red-500 hover:underline text-sm" onClick={() => handleDelete(proj.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
