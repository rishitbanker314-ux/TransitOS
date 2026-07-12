import React from 'react';
import { useDrivers } from '../hooks/useDrivers';

export const DriverDashboard: React.FC = () => {
  const { drivers, loading } = useDrivers();

  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const assignedDrivers = drivers.filter(d => d.status === 'Assigned').length;
  const onLeave = drivers.filter(d => d.status === 'On Leave' || d.status === 'Medical Leave').length;

  if (loading) {
    return <div className="grid grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-blue-500">
          <div className="text-sm text-gray-500 font-medium">Total Drivers</div>
          <div className="text-3xl font-bold mt-2">{totalDrivers}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-green-500">
          <div className="text-sm text-gray-500 font-medium">Available</div>
          <div className="text-3xl font-bold mt-2 text-green-600">{availableDrivers}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-purple-500">
          <div className="text-sm text-gray-500 font-medium">Assigned to Trips</div>
          <div className="text-3xl font-bold mt-2 text-purple-600">{assignedDrivers}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-t-4 border-orange-500">
          <div className="text-sm text-gray-500 font-medium">On Leave</div>
          <div className="text-3xl font-bold mt-2 text-orange-600">{onLeave}</div>
        </div>
      </div>
    </div>
  );
};
