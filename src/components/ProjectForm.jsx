import { useState, useEffect } from "react";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  department: "",
  durationStart: "",
  durationEnd: "",
  sponsor: "",
  attachments: [],
};

export default function ProjectForm({ onAddProject, initial }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [newAttachments, setNewAttachments] = useState([]);

  useEffect(() => {
    setForm(initial || emptyForm);
    setNewAttachments([]);
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Read and store file as base64
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(loadEvt) {
        setNewAttachments(old => [
          ...old,
          {
            name: file.name,
            type: file.type,
            data: loadEvt.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    // Reset the file input value so you can pick the same file again if needed
    e.target.value = null;
  };

  // Remove new files before submit
  const handleRemoveAttachment = (idx) => {
    setNewAttachments(arr => arr.filter((_, i) => i !== idx));
  };

  // Remove already-saved attachments in edit mode
  const handleRemoveExistingAttachment = (idx) => {
    setForm(f => ({
      ...f,
      attachments: (f.attachments || []).filter((_, i) => i !== idx),
    }));
  };

  // On submit: merge attachments, call parent handler, clear form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim()) {
      alert("Project name and department are required.");
      return;
    }
    const attachments = [ ...(form.attachments || []), ...newAttachments ];
    onAddProject({ ...form, attachments, id: form.id || Date.now().toString() });
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
      className="bg-white border shadow p-5 rounded max-w-xl mx-auto flex flex-col gap-4 mb-8"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
          required
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
          required
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="durationStart"
            value={form.durationStart}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="durationEnd"
            value={form.durationEnd}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Project Sponsor</label>
        <input
          type="text"
          name="sponsor"
          value={form.sponsor}
          onChange={handleChange}
          placeholder="Project Sponsor"
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>

      {/* ATTACHMENTS */}
      <div>
        <label className="block text-sm font-medium mb-1">Attachments</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full"
        />
        {/* New (unsaved) attachments */}
        {newAttachments.length > 0 && (
          <ul className="mt-2 text-xs">
            {newAttachments.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(idx)}
                  className="text-red-500 underline"
                >Remove</button>
              </li>
            ))}
          </ul>
        )}
        {/* Existing attachments, if editing */}
        {form.attachments && form.attachments.length > 0 && (
          <ul className="mt-2 text-xs">
            {form.attachments.map((file, idx) => (
              <li key={file.name+idx} className="flex items-center gap-2">
                <a
                  href={file.data}
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline"
                >
                  {file.name}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingAttachment(idx)}
                  className="text-red-500 underline"
                >Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-semibold transition"
        >
          {form.id ? "Update Project" : "Add Project"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 font-semibold transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
