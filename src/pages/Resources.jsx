import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";

export default function Resources() {
  const [resources, setResources] = useLocalStorage("pm_resources", []);
  const [projects] = useLocalStorage("pm_projects", []);
  const [form, setForm] = useState({ name: "", total: 1 });

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!form.name.trim() || Number(form.total) <= 0) return;
    setResources([
      ...resources,
      { id: Date.now().toString(), name: form.name, total: Number(form.total), allocated: {} }
    ]);
    setForm({ name: "", total: 1 });
  };

  const handleAllocate = (resId, projId, count) => {
    setResources(resources.map(res => {
      if (res.id !== resId) return res;
      const allocSum = Object.values(res.allocated).reduce((a, b) => a + b, 0);
      const available = res.total - allocSum;
      if (count > available) return res;
      return {
        ...res,
        allocated: { ...res.allocated, [projId]: (res.allocated[projId] || 0) + count }
      };
    }));
  };

  const getAvailable = (res) => res.total - Object.values(res.allocated).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-5">Resources</h2>
      <form onSubmit={handleAddResource} className="flex gap-3 items-end mb-6">
        <input
          type="text"
          placeholder="Resource/Team Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="border border-gray-300 rounded px-2 py-1 w-52"
        />
        <input
          type="number"
          placeholder="Total"
          min={1}
          value={form.total}
          onChange={e => setForm({ ...form, total: e.target.value })}
          required
          className="border border-gray-300 rounded px-2 py-1 w-24"
        />
        <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700">Add Resource</button>
      </form>
      <div className="space-y-4">
        {resources.length === 0 && <div>No resources yet.</div>}
        {resources.map(res => (
          <div key={res.id} className="bg-white p-4 rounded shadow border-l-4 border-indigo-500">
            <div className="font-bold">{res.name} <span className="text-gray-400 font-normal">({res.total} total, {getAvailable(res)} available)</span></div>
            <div>
              <div className="font-semibold mt-2 mb-1">Allocation</div>
              {projects.length === 0 ? (
                <em className="text-gray-400">No projects available</em>
              ) : (
                <div className="flex flex-col gap-1">
                  {projects.map(proj => (
                    <div key={proj.id} className="flex gap-2 items-center">
                      <span>{proj.name}: {res.allocated[proj.id] || 0}</span>
                      <button
                        disabled={getAvailable(res) < 1}
                        onClick={() => handleAllocate(res.id, proj.id, 1)}
                        className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-40"
                      >
                        +1 allocate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
