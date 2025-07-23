import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Tasks from './pages/Tasks';
import StatusBoard from './pages/StatusBoard';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 ml-[200px] text-left overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/projects" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/status" element={<StatusBoard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
