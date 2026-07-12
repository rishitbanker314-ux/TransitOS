import React from 'react';
import { Driver } from '../types/driver.types';

interface DriverProfileProps {
  driver: Driver;
}

export const DriverProfile: React.FC<DriverProfileProps> = ({ driver }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
          {driver.firstName[0]}{driver.lastName[0]}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{driver.firstName} {driver.lastName}</h2>
          <div className="text-gray-500 text-sm">Joined {new Date(driver.joinedAt).toLocaleDateString()}</div>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${driver.status === 'Available' ? 'bg-green-100 text-green-800' : 
              driver.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'}`}>
            {driver.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Email</span>
              <span>{driver.email}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Phone</span>
              <span>{driver.phone}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Personal Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Date of Birth</span>
              <span>{new Date(driver.dateOfBirth).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
