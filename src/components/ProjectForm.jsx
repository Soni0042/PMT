import { useState, useEffect } from "react";

// Skill options and status options
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

const STATUS_OPTIONS = [
  "Open",
  "WIP",
  "Under Development",
  "Internal UAT",
  "Completed"
];

const emptyForm = {
  id: null,
  name: "",
  description: "",
  department: "",
  status: STATUS_OPTIONS[0],   // Default to "Open"
  durationStart: "",
  durationEnd: "",
  sponsor: "",
  attachments: [],
  skillsets: [],               // Array holding skills added one-by-one
};

export default function ProjectForm({ onAddProject, initial }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [newAttachments, setNewAttachments] = useState([]);
  const [newSkill, setNewSkill] = useState(""); // For adding next skill

  useEffect(() => {
    setForm(initial || emptyForm);
    setNewAttachments([]);
    setNewSkill("");
  }, [initial]);

  // Generic input change handler for most fields
  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Add one skill at a time from dropdown
  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !form.skillsets.includes(skill) && SKILL_OPTIONS.includes(skill)) {
      setForm(f => ({ ...f, skillsets: [...f.skillsets, skill] }));
      setNewSkill("");
    }
  };

  // Remove a skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setForm(f => ({
      ...f,
      skillsets: f.skillsets.filter(skill => skill !== skillToRemove)
    }));
  };

  // Add skill on Enter key pressed
  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // File handling for attachments
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (loadEvt) {
        setNewAttachments(old => [
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
    setNewAttachments(arr => arr.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingAttachment = (idx) => {
    setForm(f => ({
      ...f,
      attachments: (f.attachments || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.department.trim() ||
      !form.status ||
      !form.durationStart ||
      !form.durationEnd ||
      !form.sponsor.trim() ||
      form.skillsets.length === 0
    ) {
      alert("Please fill out all required fields and add at least one skill.");
      return;
    }
    // Dates validation
    const { durationStart, durationEnd } = form;
    if (durationStart && durationEnd && durationEnd < durationStart) {
      alert("End date must be after start date.");
      return;
    }
    const attachments = [...(form.attachments || []), ...newAttachments];
    onAddProject({
      ...form,
      attachments,
      id: form.id || Date.now().toString(),
      status: form.status || STATUS_OPTIONS[0],
    });
    setForm(emptyForm);
    setNewAttachments([]);
    setNewSkill("");
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setNewAttachments([]);
    setNewSkill("");
  };

  const Star = <span className="text-red-600">*</span>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border shadow-2xl p-7 rounded-2xl max-w-2xl mx-auto flex flex-col gap-6 mb-12"
    >

      {/* Project Name */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Project Name {Star}
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

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Description {Star}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Department {Star}
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

      {/* Status Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Status {Star}
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-indigo-900 mb-1">
            Start Date {Star}
          </label>
          <input
            type="date"
            name="durationStart"
            value={form.durationStart}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-indigo-900 mb-1">
            End Date {Star}
          </label>
          <input
            type="date"
            name="durationEnd"
            value={form.durationEnd}
            onChange={handleChange}
            required
            min={form.durationStart || undefined}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </div>

      {/* Project Sponsor */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Project Sponsor {Star}
        </label>
        <input
          type="text"
          name="sponsor"
          value={form.sponsor}
          onChange={handleChange}
          placeholder="Project Sponsor"
          required
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Skillset - Add Another Skill Feature */}
      <div>
        <label className="block text-sm font-semibold text-indigo-900 mb-1">
          Skillset Required {Star}
        </label>

        {/* Selected skills as tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {form.skillsets.map((skill) => (
            <div
              key={skill}
              className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded flex items-center gap-2"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-indigo-600 hover:text-indigo-900 font-bold"
                aria-label={`Remove skill ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add skill dropdown + Add button */}
        <div className="flex gap-2">
          <select
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleSkillInputKeyDown}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="">Select a skill to add</option>
            {SKILL_OPTIONS.filter(skill => !form.skillsets.includes(skill)).map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!newSkill}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition ${!newSkill ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Add
          </button>
        </div>
      </div>

      {/* Attachments */}
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
        {/* New attachments list */}
        {newAttachments.length > 0 && (
          <ul className="mt-3 rounded-lg bg-indigo-50 p-3 max-h-40 overflow-auto">
            {newAttachments.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <span className="text-indigo-900 font-semibold truncate">{file.name}</span>
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
        {/* Existing attachments list */}
        {form.attachments && form.attachments.length > 0 && (
          <ul className="mt-2 rounded-lg bg-indigo-50 p-3 max-h-40 overflow-auto">
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

      {/* Form action buttons */}
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
