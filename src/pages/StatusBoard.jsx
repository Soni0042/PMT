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
      <h2 className="font-bold text-2xl mb-5">Project Status Board</h2>
      <div className="flex gap-6 items-start overflow-x-auto">
        {projectsByStatus.map(group => (
          <div key={group.status} className="min-w-[260px] p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-center font-semibold mb-3">{group.status}</h3>
            {group.projects.length === 0 ? (
              <div className="italic text-gray-400">No projects</div>
            ) : (
              group.projects.map(proj => (
                <div key={proj.id} className="bg-white p-3 mb-3 rounded shadow border-l-4 border-indigo-400">
                  <div className="font-bold">{proj.name}</div>
                  <div className="text-sm text-gray-500 mb-2">Dept: {proj.department}</div>
                  <select
                    value={proj.status}
                    onChange={e => handleStatusChange(proj.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
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
