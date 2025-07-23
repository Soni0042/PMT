import { useLocalStorage } from "../hooks/useLocalStorage";

const STATUS_OPTIONS = [
  "Open",
  "WIP",
  "Under Development",
  "Internal UAT",
  "Completed"
];

export default function StatusBoard() {
  const [projects, setProjects] = useLocalStorage("pm_projects", []);

  const handleStatusChange = (projectId, status) => {
    setProjects(
      projects.map(p =>
        p.id === projectId ? { ...p, status } : p
      )
    );
  };

  const projectsByStatus = STATUS_OPTIONS.map(status => ({
    status,
    projects: projects.filter(p => p.status === status)
  }));

  return (
    <div>
      <h2 className="font-bold text-2xl mb-7 text-left">Project Status Board</h2>
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {projectsByStatus.map(group => (
          <div key={group.status} className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col min-h-[220px]">
            <h3 className="text-center font-semibold text-lg mb-5 text-indigo-950 tracking-wide">
              {group.status}
            </h3>
            {group.projects.length === 0 ? (
              <div className="italic text-gray-400 text-center py-8">No projects</div>
            ) : (
              group.projects.map(proj => (
                <div key={proj.id} className="bg-white mb-5 rounded-xl shadow-lg border-l-4 border-indigo-500 p-4 flex flex-col">
                  <div className="font-bold text-indigo-800 text-base mb-1">{proj.name}</div>
                  <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                    <span>Dept: {proj.department}</span>
                  </div>
                  <select
                    value={proj.status}
                    onChange={e => handleStatusChange(proj.id, e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-indigo-900 mt-1 focus:outline-indigo-400 transition"
                  >
                    {STATUS_OPTIONS.map(s =>
                      <option value={s} key={s}>{s}</option>
                    )}
                  </select>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
