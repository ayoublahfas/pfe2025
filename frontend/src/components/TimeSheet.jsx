import React, { useState } from 'react';
import { Button } from "./ui/button";
import Dashboard from './Dashboard';

const TimeSheet = () => {
  const [status, setStatus] = useState('');

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg m-4">
      {/* Section Dashboard avec styles dark mode */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Cartes statistiques */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Performance
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              View your performance metrics
            </p>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Time Tracking
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Monitor your working hours
            </p>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Projects
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Track project progress
            </p>
          </div>
        </div>

        {/* Section Dashboard */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default TimeSheet; 