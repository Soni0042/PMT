import { useState, useEffect } from "react";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  department: "",
  durationStart: "",
  durationEnd: "",
  sponsor: "",
};

export default function ProjectForm({ onAddProject, initial }) {
  const [form, setForm] = useState(initial || emptyForm);

  // If 'initial' changes (for editing), update the form; if it's undefined/null, reset to empty
  useEffect(() => {
    setForm(initial || emptyForm);
  }, [initial]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.department.trim()) {
      alert("Project name and department are required.");
      return;
    }
    onAddProject({ ...form, id: form.id || Date.now().toString() });
    setForm(emptyForm); // always reset to empty after submit
  };

  const handleCancel = () => {
    setForm(emptyForm);
    // Optionally, call a parent prop to signal canceling edit mode if needed
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2em" }}>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Project Name"
        required
      /><br />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows="3"
      /><br />
      <input
        type="text"
        name="department"
        value={form.department}
        onChange={handleChange}
        placeholder="Department"
        required
      /><br />
      <label>
        Start Date:
        <input
          type="date"
          name="durationStart"
          value={form.durationStart}
          onChange={handleChange}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          name="durationEnd"
          value={form.durationEnd}
          onChange={handleChange}
        />
      </label><br />
      <input
        type="text"
        name="sponsor"
        value={form.sponsor}
        onChange={handleChange}
        placeholder="Project Sponsor"
      /><br />
      <button type="submit">{form.id ? "Update Project" : "Add Project"}</button>
      {form.id && (
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
