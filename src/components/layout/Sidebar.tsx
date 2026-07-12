import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Users, Map, Wrench, Fuel, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/fleet', label: 'Fleet', icon: Car },
  { path: '/drivers', label: 'Drivers', icon: Users },
  { path: '/trips', label: 'Trips', icon: Map },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/fuel', label: 'Fuel & Expenses', icon: Fuel },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1a1a1a] border-r border-[#333] flex flex-col flex-shrink-0 text-[#ccc] font-sans">
      <div className="h-16 flex items-center px-6 border-b border-[#333]">
        <h1 className="text-2xl font-bold text-white tracking-wide">TransitOps</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 transition-colors ${
                    isActive 
                      ? 'border-l-4 border-amber-500 text-amber-500 bg-[#222]' 
                      : 'border-l-4 border-transparent hover:bg-[#222] hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-lg">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
