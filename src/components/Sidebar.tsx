import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FolderKanban, 
  Users, 
  Settings,
  Menu,
  Hexagon
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-[#3c4b54] text-white min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <NavLink to="/home" className="text-xl font-semibold flex items-center gap-2">
          <Hexagon className="text-green-500" size={24} />
          <span>ZetaForms</span>
        </NavLink>
        <button className="text-gray-400 hover:text-white">
          <Menu size={20} />
        </button>
      </div>
      
      <nav className="flex-1 p-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive ? 'bg-[#2d383f] text-white' : 'text-gray-300 hover:bg-[#2d383f] hover:text-white'
            }`
          }
        >
          <FolderKanban size={20} />
          Projects
        </NavLink>
        
        <NavLink
          to="/teams"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive ? 'bg-[#2d383f] text-white' : 'text-gray-300 hover:bg-[#2d383f] hover:text-white'
            }`
          }
        >
          <Users size={20} />
          Teams
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive ? 'bg-[#2d383f] text-white' : 'text-gray-300 hover:bg-[#2d383f] hover:text-white'
            }`
          }
        >
          <Settings size={20} />
          Account Settings
        </NavLink>
      </nav>
    </div>
  );
};