import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";
import ProjectForm from '../components/ProjectForm';

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
      <h2 className="font-bold text-2xl mb-8 text-left">Projects</h2>
      <div className="mb-8">
        <ProjectForm onAddProject={handleAddOrUpdate} initial={editingProject}/>
      </div>
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {projects.length === 0 && (
          <div className="col-span-full text-gray-400 italic text-center py-10 bg-white rounded-xl shadow">
            No projects yet.
          </div>
        )}
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 border-l-8 border-indigo-500 transition hover:shadow-2xl"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold text-lg text-indigo-900">{proj.name}</span>
              <span className="px-3 py-1 rounded-md text-xs bg-indigo-100 text-indigo-700 font-semibold uppercase tracking-wide">
                {proj.status}
              </span>
            </div>
            <div className="text-gray-700 text-sm mb-2">{proj.description}</div>
            <div className="gap-3 flex flex-wrap text-xs text-gray-500 mb-1">
              <span><strong>Department:</strong> {proj.department}</span>
              <span><strong>Sponsor:</strong> {proj.sponsor || '-'}</span>
              <span><strong>Duration:</strong> {proj.durationStart ? proj.durationStart : "?"} – {proj.durationEnd ? proj.durationEnd : "?"}</span>
            </div>
            {proj.attachments && proj.attachments.length > 0 && (
              <div className="mt-1">
                <div className="font-semibold text-xs mb-1 text-indigo-700">Attachments:</div>
                <ul>
                  {proj.attachments.map((file, idx) => (
                    <li key={file.name+idx}>
                      <a
                        href={file.data}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline text-xs"
                      >
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-4 justify-end mt-3">
              <button
                className="px-4 py-1 rounded font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 text-xs transition"
                onClick={() => handleEdit(proj.id)}
              >
                Edit
              </button>
              <button
                className="px-4 py-1 rounded font-semibold text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-800 text-xs transition"
                onClick={() => handleDelete(proj.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
