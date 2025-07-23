// src/pages/Dashboard.jsx

import { useLocalStorage } from "../hooks/useLocalStorage";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { CSVLink } from "react-csv";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [projects] = useLocalStorage("pm_projects", []);
  const [tasks] = useLocalStorage("pm_tasks", []);
  const [resources] = useLocalStorage("pm_resources", []);

  // KPI cards
  const projectsCount = projects.length;
  const tasksCount = tasks.length;
  const resourcesCount = resources.length;

  // Bar chart: Tasks by status
  const statusList = ["Open", "In Progress", "Blocked", "Completed"];
  const statusData = statusList.map(
    (status) => tasks.filter((t) => t.status === status).length
  );
  const barData = {
    labels: statusList,
    datasets: [
      {
        label: "Tasks",
        data: statusData,
        backgroundColor: "#6366f1",
      },
    ],
  };

  // Pie chart: Projects by department
  const depGroups = [...new Set(projects.map((p) => p.department || "N/A"))];
  const depData = depGroups.map((dep) =>
    projects.filter((p) => (p.department || "N/A") === dep).length
  );
  const pieData = {
    labels: depGroups,
    datasets: [
      {
        label: "Projects",
        data: depData,
        backgroundColor: [
          "#6366f1",
          "#22d3ee",
          "#fbbf24",
          "#10b981",
          "#f472b6",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="p-2 md:p-4">
      <h2 className="text-2xl font-bold mb-7">Analytics Dashboard</h2>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-indigo-50 p-4 rounded text-center shadow">
          <div className="text-3xl font-bold text-indigo-700">{projectsCount}</div>
          <div className="text-gray-600 mt-1">Projects</div>
        </div>
        <div className="bg-green-50 p-4 rounded text-center shadow">
          <div className="text-3xl font-bold text-green-700">{tasksCount}</div>
          <div className="text-gray-600 mt-1">Tasks</div>
        </div>
        <div className="bg-blue-50 p-4 rounded text-center shadow">
          <div className="text-3xl font-bold text-blue-700">{resourcesCount}</div>
          <div className="text-gray-600 mt-1">Resources</div>
        </div>
      </div>
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-5 rounded shadow">
          <div className="font-semibold mb-2">Tasks by Status</div>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-5 rounded shadow">
          <div className="font-semibold mb-2">Projects by Department</div>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>
      {/* CSV EXPORT */}
      <ExportSection projects={projects} tasks={tasks} resources={resources} />
    </div>
  );
}

function ExportSection({ projects, tasks, resources }) {
  return (
    <div className="bg-gray-50 rounded-lg shadow p-5">
      <h3 className="font-semibold mb-3">Export Data as CSV</h3>
      <div className="flex flex-wrap gap-4">
        <CSVLink
          data={projects}
          filename="projects.csv"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Export Projects
        </CSVLink>
        <CSVLink
          data={tasks}
          filename="tasks.csv"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Export Tasks
        </CSVLink>
        <CSVLink
          data={resources}
          filename="resources.csv"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Export Resources
        </CSVLink>
      </div>
    </div>
  );
}
