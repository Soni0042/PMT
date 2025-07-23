import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <h1>PM Tracker</h1>
      <ul>
        <li><NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink></li>
        <li><NavLink to="/projects" className={({isActive}) => isActive ? "active" : ""}>Projects</NavLink></li>
        <li><NavLink to="/resources" className={({isActive}) => isActive ? "active" : ""}>Resources</NavLink></li>
        <li><NavLink to="/tasks" className={({isActive}) => isActive ? "active" : ""}>Tasks</NavLink></li>
        <li><NavLink to="/status" className={({isActive}) => isActive ? "active" : ""}>Status Board</NavLink></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
