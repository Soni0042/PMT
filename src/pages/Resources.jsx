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
      <h2 className="font-bold text-2xl mb-8 text-left">Resources</h2>
      <form onSubmit={handleAddResource} className="flex gap-4 items-end mb-10 bg-white rounded-xl shadow p-6 max-w-2xl">
        <div className="flex flex-col flex-1">
          <label className="mb-1 font-medium text-sm text-indigo-900">Resource/Team Name</label>
          <input
            type="text"
            placeholder="Resource/Team Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col" style={{ width: 110 }}>
          <label className="mb-1 font-medium text-sm text-indigo-900">Total</label>
          <input
            type="number"
            placeholder="Total"
            min={1}
            value={form.total}
            onChange={e => setForm({ ...form, total: e.target.value })}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
          Add Resource
        </button>
      </form>
      <div className="space-y-5">
        {resources.length === 0 && (
          <div className="italic text-gray-400 text-center py-10 bg-white rounded-xl shadow">No resources yet.</div>
        )}
        {resources.map(res => (
          <div key={res.id} className="bg-white rounded-2xl shadow-md border-l-8 border-indigo-400 px-6 py-6">
            <div className="font-bold text-xl text-indigo-900 mb-1 flex items-center gap-3">
              {res.name}
              <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                {res.total} total, {getAvailable(res)} available
              </span>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-sm mb-2 text-indigo-700">Allocations per Project</div>
              {projects.length === 0 ? (
                <em className="text-gray-400">No projects available</em>
              ) : (
                <div className="space-y-2">
                  {projects.map(proj => (
                    <div key={proj.id} className="flex flex-row gap-3 items-center justify-between bg-indigo-50 rounded p-2">
                      <span className="text-sm flex-1">{proj.name}: <span className="font-bold text-indigo-900">{res.allocated[proj.id] || 0}</span></span>
                      <button
                        disabled={getAvailable(res) < 1}
                        onClick={() => handleAllocate(res.id, proj.id, 1)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                      >+1 allocate</button>
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
