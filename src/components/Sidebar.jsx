// src/components/Sidebar.jsx

import { Link } from 'react-router-dom';
import './Sidebar.css'; // create this for custom styles

function Sidebar() {
  return (
    <nav className="sidebar">
      <h1>PM Tracker</h1>
      <ul>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/resources">Resources</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/status">Status Board</Link></li>
      </ul>
    </nav>
  );
}


export default Sidebar;
