import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState, memo } from "react";

const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "AWS", "UI/UX",
  "Data Science", "DevOps", "Testing",
];

export default function Resources() {
  const [resources, setResources] = useLocalStorage("pm_resources", []);
  const [projects] = useLocalStorage("pm_projects", []);
  const [form, setForm] = useState({ name: "", total: 1, skillset: "" });
  const [allocInput, setAllocInput] = useState({});
  const [editResourceId, setEditResourceId] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [error, setError] = useState("");

  // Add or update resource
  const handleAddResource = (e) => {
    e.preventDefault();
    if (!form.name.trim() || Number(form.total) <= 0) {
      setError("Must enter a name and total > 0");
      return;
    }
    if (editResourceId) {
      setResources(resources.map(res =>
        res.id === editResourceId
          ? { ...res, name: form.name, total: Number(form.total), skillset: form.skillset }
          : res
      ));
      setEditResourceId(null);
    } else {
      setResources([
        ...resources,
        {
          id: Date.now().toString(),
          name: form.name,
          total: Number(form.total),
          skillset: form.skillset,
          allocated: {},
        },
      ]);
    }
    setForm({ name: "", total: 1, skillset: "" });
    setError("");
  };

  // Allocation handlers
  const handleAllocate = (resId, projId, count) => {
    setResources(resources.map(res => {
      if (res.id !== resId) return res;
      const allocSum = Object.values(res.allocated).reduce((a, b) => a + b, 0);
      const available = res.total - allocSum;
      if (count > available || count <= 0) { setError("Not enough available units!"); return res; }
      setError("");
      return {
        ...res,
        allocated: { ...res.allocated, [projId]: (res.allocated[projId] || 0) + count }
      };
    }));
  };
  const handleDeallocate = (resId, projId, count) => {
    setResources(resources.map(res => {
      if (res.id !== resId) return res;
      const current = res.allocated[projId] || 0;
      if (current < count) { setError("Nothing more to deallocate!"); return res; }
      setError("");
      return {
        ...res,
        allocated: { ...res.allocated, [projId]: current - count }
      };
    }));
  };

  // Remove/Edit
  const handleDeleteResource = (id) => {
    if (!window.confirm("Are you sure to delete this resource?")) return;
    setResources(resources.filter(r => r.id !== id));
    if (editResourceId === id) setEditResourceId(null);
  };
  const handleEdit = (res) => {
    setEditResourceId(res.id);
    setForm({ name: res.name, total: res.total, skillset: res.skillset });
  };

  // Allow only resources with selected skillset if filtered
  const filteredResources = skillFilter
    ? resources.filter(r => r.skillset === skillFilter)
    : resources;

  // Helper for resource available units
  const getAvailable = (res) => res.total - Object.values(res.allocated).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-8 text-left">Resources</h2>
      {/* Skillset filter dropdown */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filter by Skillset:</label>
        <select
          value={skillFilter}
          onChange={e => setSkillFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Skills</option>
          {SKILL_OPTIONS.map(skill => (
            <option value={skill} key={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Add/Edit resource */}
      <form onSubmit={handleAddResource} className="flex flex-col md:flex-row gap-4 items-end mb-10 bg-white rounded-xl shadow p-6 max-w-2xl">
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
        <div className="flex flex-col flex-1">
          <label className="mb-1 font-medium text-sm text-indigo-900">Skillset</label>
          <select
            value={form.skillset}
            onChange={e => setForm({ ...form, skillset: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Select skillset</option>
            {SKILL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
          {editResourceId ? "Save" : "Add Resource"}
        </button>
        {editResourceId && (
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 ml-2 rounded-lg font-bold hover:bg-gray-300 transition"
            onClick={() => {
              setEditResourceId(null);
              setForm({ name: "", total: 1, skillset: "" });
            }}
          >Cancel</button>
        )}
      </form>
      {error && <div className="text-red-600 font-bold mb-3">{error}</div>}
      <div className="space-y-5">
        {filteredResources.length === 0 && (
          <div className="italic text-gray-400 text-center py-10 bg-white rounded-xl shadow">No resources yet.</div>
        )}
        {filteredResources
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(res => (
            <ResourceCard
              key={res.id}
              res={res}
              projects={projects}
              editResourceId={editResourceId}
              handleEdit={handleEdit}
              handleDeleteResource={handleDeleteResource}
              handleAllocate={handleAllocate}
              handleDeallocate={handleDeallocate}
              getAvailable={getAvailable}
              allocInput={allocInput}
              setAllocInput={setAllocInput}
            />
        ))}
      </div>
    </div>
  );
}

// ResourceCard as a memoized component
const ResourceCard = memo(function ResourceCard({
  res, projects, editResourceId, handleEdit, handleDeleteResource,
  handleAllocate, handleDeallocate, getAvailable,
  allocInput, setAllocInput
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border-l-8 border-indigo-400 px-6 py-6">
      <div className="flex items-center justify-between mb-1 flex-wrap">
        <span className="font-bold text-xl text-indigo-900">{res.name}</span>
        <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
          {res.total} total, {getAvailable(res)} available
        </span>
        {res.skillset && (
          <span className="ml-3 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">{res.skillset}</span>
        )}
      </div>
      {/* Utilization Bar */}
      <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-4">
        <div
          className="h-2 bg-indigo-500 rounded"
          style={{
            width: `${Math.round(100 * (res.total - getAvailable(res)) / (res.total || 1))}%`
          }}
          title={`Allocated: ${res.total - getAvailable(res)} / ${res.total}`}
        />
      </div>
      {/* Allocations */}
      <div className="mt-3">
        <div className="font-semibold text-sm mb-2 text-indigo-700">Allocations per Project</div>
        {projects.length === 0 ? (
          <em className="text-gray-400">No projects available</em>
        ) : (
          <div className="space-y-2">
            {projects
              .slice().sort((a, b) => a.name.localeCompare(b.name))
              .map(proj => (
                <div key={proj.id} className="flex flex-row gap-3 items-center justify-between bg-indigo-50 rounded p-2">
                  <span className="text-sm flex-1">
                    {proj.name}: <span className="font-bold text-indigo-900">{res.allocated[proj.id] || 0}</span>
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={getAvailable(res)}
                    placeholder="Qty"
                    value={allocInput[res.id + "_" + proj.id] || ""}
                    onChange={e =>
                      setAllocInput({ ...allocInput, [res.id + "_" + proj.id]: e.target.value })
                    }
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <button
                    disabled={getAvailable(res) < (Number(allocInput[res.id + "_" + proj.id]) || 1)}
                    onClick={() => {
                      const amt = Number(allocInput[res.id + "_" + proj.id]) || 1;
                      handleAllocate(res.id, proj.id, amt);
                      setAllocInput({ ...allocInput, [res.id + "_" + proj.id]: "" });
                    }}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 disabled:opacity-60"
                  >Allocate</button>
                  {/* De-allocate button */}
                  <button
                    disabled={!res.allocated[proj.id]}
                    onClick={() => handleDeallocate(res.id, proj.id, 1)}
                    className="px-2 py-1 text-sm bg-red-200 text-red-700 rounded font-semibold hover:bg-red-300 disabled:opacity-50"
                  >-1</button>
                </div>
              ))}
          </div>
        )}
      </div>
      {/* Edit & Delete */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handleEdit(res)}
          className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
        >Edit</button>
        <button
          onClick={() => handleDeleteResource(res.id)}
          className="px-3 py-1 text-sm bg-red-200 text-red-700 rounded hover:bg-red-300"
        >Delete</button>
      </div>
    </div>
  );
});
