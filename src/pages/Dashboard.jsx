import { useLocalStorage } from "../hooks/useLocalStorage";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { exportToXLSX } from "../utils/exportXLSX"; // <------ NEW

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
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.6,
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
          "#8b5cf6",
        ],
      },
    ],
  };

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-10 text-left tracking-tight">Analytics Dashboard</h2>
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <KpiCard value={projectsCount} label="Projects" color="indigo" />
        <KpiCard value={tasksCount} label="Tasks" color="green" />
        <KpiCard value={resourcesCount} label="Resources" color="blue" />
      </div>
      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
        <div className="bg-white p-7 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="font-semibold mb-3 text-lg text-indigo-900">Tasks by Status</div>
          <div className="w-full" style={{ minHeight: 250 }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-7 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="font-semibold mb-3 text-lg text-indigo-900">Projects by Department</div>
          <div className="w-full" style={{ minHeight: 250 }}>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>
      </div>
      <ExportSection projects={projects} tasks={tasks} resources={resources} />
    </div>
  );
}

function KpiCard({ value, label, color }) {
  const colorMap = {
    indigo: "text-indigo-700 bg-indigo-50",
    green: "text-green-700 bg-green-50",
    blue: "text-blue-700 bg-blue-50",
  };
  return (
    <div className={`rounded-2xl shadow-lg flex flex-col items-center py-8 ${colorMap[color]}`}>
      <div className={`text-5xl font-extrabold mb-2`}>
        {value}
      </div>
      <div className="text-lg uppercase font-bold tracking-wide">{label}</div>
    </div>
  );
}

// ---- CHANGED EXPORT SECTION BELOW ----
function ExportSection({ projects, tasks, resources }) {
  return (
    <div className="bg-gray-50 rounded-2xl shadow p-8 max-w-2xl mx-auto">
      <h3 className="font-semibold mb-3 text-lg text-indigo-900">Export Data as XLSX</h3>
      <div className="flex flex-wrap gap-6">
        <button
          onClick={() => exportToXLSX(projects, "projects.xlsx")}
          className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
        >
          Export Projects
        </button>
        <button
          onClick={() => exportToXLSX(tasks, "tasks.xlsx")}
          className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow"
        >
          Export Tasks
        </button>
        <button
          onClick={() => exportToXLSX(resources, "resources.xlsx")}
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
        >
          Export Resources
        </button>
      </div>
    </div>
  );
}
