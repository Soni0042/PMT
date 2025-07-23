import { useState, useEffect } from "react";

// Add your global skill options here:
const SKILL_OPTIONS = [
  "React",
  "Node.js",
  "Python",
  "AWS",
  "UI/UX",
  "Data Science",
  "DevOps",
  "Testing",
];

const emptyForm = {
  id: null,
  name: "",
  description: "",
  department: "",
  durationStart: "",
  durationEnd: "",
  sponsor: "",
  attachments: [],
  skillsets: [], // -- as always an array but will have 0 or 1 selected value
};

export default function ProjectForm({ onAddProject, initial }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [newAttachments, setNewAttachments] = useState([]);

  useEffect(() => {
    setForm(initial || emptyForm);
    setNewAttachments([]);
  }, [initial]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // --- Skillset single-select dropdown handler ---
  const handleSkillChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      skillsets: value ? [value] : [],
    }));
  };

  // --- File attachment logic (unchanged) ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (loadEvt) {
        setNewAttachments((old) => [
          ...old,
          {
            name: file.name,
            type: file.type,
            data: loadEvt.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const handleRemoveAttachment = (idx) => {
    setNewAttachments((arr) => arr.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingAttachment = (idx) => {
    setForm((f) => ({
      ...f,
      attachments: (f.attachments || []).filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim()) {
      alert("Project name and department are required.");
      return;
    }
    const attachments = [...(form.attachments || []), ...newAttachments];
    onAddProject({
      ...form,
      attachments,
      id: form.id || Date.now().toString(),
    });
    setForm(emptyForm);
    setNewAttachments([]);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setNewAttachments([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border shadow-2xl p-7 rounded-2xl max-w-2xl mx-auto flex flex-col gap-6 mb-12"
    >
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Project Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
          required
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Department
        </label>
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          required
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-indigo-900 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="durationStart"
            value={form.durationStart}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-indigo-900 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="durationEnd"
            value={form.durationEnd}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Project Sponsor
        </label>
        <input
          type="text"
          name="sponsor"
          value={form.sponsor}
          onChange={handleChange}
          placeholder="Project Sponsor"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* --- SKILLSET REQUIRED SINGLE-SELECT DROPDOWN --- */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Skillset Required
        </label>
        <select
          name="skillsets"
          value={form.skillsets[0] || ""}
          onChange={handleSkillChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        >
          <option value="">Select a skill</option>
          {SKILL_OPTIONS.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>

      {/* --- ATTACHMENTS (unchanged) --- */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Attachments
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="project-attachments"
            className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg cursor-pointer font-bold hover:bg-indigo-700 transition"
          >
            Choose Files
            <input
              id="project-attachments"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <span
            className={`text-sm ${
              newAttachments.length
                ? "text-indigo-700 font-medium"
                : "text-gray-400 italic"
            }`}
          >
            {newAttachments.length === 0
              ? "No files chosen"
              : newAttachments.map((f) => f.name).join(", ")}
          </span>
        </div>
        {/* New attachments */}
        {newAttachments.length > 0 && (
          <ul className="mt-3 rounded-lg bg-indigo-50 p-3">
            {newAttachments.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <span className="text-indigo-900 font-semibold truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(idx)}
                  className="text-xs text-red-600 font-bold underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* Existing attachments */}
        {form.attachments && form.attachments.length > 0 && (
          <ul className="mt-2 rounded-lg bg-indigo-50 p-3">
            {form.attachments.map((file, idx) => (
              <li key={file.name + idx} className="flex items-center gap-2 mb-1">
                <a
                  href={file.data}
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-700 underline text-xs truncate"
                >
                  {file.name}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingAttachment(idx)}
                  className="text-xs text-red-600 font-bold underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 font-bold transition"
        >
          {form.id ? "Update Project" : "Add Project"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-300 font-bold transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
