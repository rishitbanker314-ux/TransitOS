import React from 'react';
import { useDrivers } from '../hooks/useDrivers';

export const DriverTable: React.FC = () => {
  const { drivers, loading, error, hasMore, loadMore } = useDrivers();

  if (loading && drivers.length === 0) {
    return <div className="skeleton-loader p-8">Loading drivers...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading drivers: {error.message}</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <th className="p-4 font-medium text-gray-500">Driver Name</th>
            <th className="p-4 font-medium text-gray-500">Contact</th>
            <th className="p-4 font-medium text-gray-500">Status</th>
            <th className="p-4 font-medium text-gray-500">Joined</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <td className="p-4 font-medium">{driver.firstName} {driver.lastName}</td>
              <td className="p-4 text-sm text-gray-500">
                <div>{driver.email}</div>
                <div>{driver.phone}</div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${driver.status === 'Available' ? 'bg-green-100 text-green-800' : 
                    driver.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {driver.status}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-500">
                {new Date(driver.joinedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {drivers.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                No drivers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hasMore && (
        <div className="p-4 flex justify-center">
          <button 
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
