import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";
import ProjectForm from '../components/ProjectForm';

const STATUS_OPTIONS = [
  "Open",
  "WIP",
  "Under Development",
  "Internal UAT",
  "Completed"
];

export default function Projects() {
  const [projects, setProjects] = useLocalStorage("pm_projects", []);
  const [editId, setEditId] = useState(null);

  // Extract unique values for filters
  const departmentList = [...new Set(projects.map(p => p.department).filter(Boolean))];
  const sponsorList = [...new Set(projects.map(p => p.sponsor).filter(Boolean))];

  // Filter states
  const [deptFilter, setDeptFilter] = useState("All");
  const [sponsorFilter, setSponsorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add or update projects
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
  const handleStatusChange = (id, newStatus) => {
    setProjects(projects.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    ));
  };
  const editingProject = projects.find(p => p.id === editId);

  // Filter projects by filters
  const filteredProjects = projects.filter(proj =>
    (deptFilter === "All" || proj.department === deptFilter) &&
    (sponsorFilter === "All" || proj.sponsor === sponsorFilter) &&
    (statusFilter === "All" || proj.status === statusFilter)
  );

  return (
    <div>
      <h2 className="font-bold text-2xl mb-6 text-left">Projects</h2>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Department Filter */}
        {departmentList.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="All">All</option>
              {departmentList.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sponsor Filter */}
        {sponsorList.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Sponsor</label>
            <select
              value={sponsorFilter}
              onChange={e => setSponsorFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="All">All</option>
              {sponsorList.map(sponsor => (
                <option key={sponsor} value={sponsor}>{sponsor}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="All">All</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Form */}
      <div className="mb-8">
        <ProjectForm onAddProject={handleAddOrUpdate} initial={editingProject} />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-gray-400 italic text-center py-10 bg-white rounded-xl shadow">
            No projects found with current filters.
          </div>
        )}
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 border-l-8 border-indigo-500 transition hover:shadow-2xl"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold text-lg text-indigo-900">{proj.name}</span>
              <select
                value={proj.status || STATUS_OPTIONS[0]}
                onChange={e => handleStatusChange(proj.id, e.target.value)}
                className="px-3 py-1 rounded-md text-xs bg-indigo-100 text-indigo-700 font-semibold uppercase tracking-wide border-indigo-400 border focus:outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
                aria-label="Change project status"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="text-gray-700 text-sm mb-2">{proj.description}</div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-1">
              <span><strong>Department:</strong> {proj.department}</span>
              <span><strong>Sponsor:</strong> {proj.sponsor || '-'}</span>
              <span><strong>Duration:</strong> {proj.durationStart ?? "?"} – {proj.durationEnd ?? "?"}</span>
            </div>
            {proj.attachments && proj.attachments.length > 0 && (
              <div className="mt-1">
                <div className="font-semibold text-xs mb-1 text-indigo-700">Attachments:</div>
                <ul>
                  {proj.attachments.map((file, idx) => (
                    <li key={file.name + idx}>
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
