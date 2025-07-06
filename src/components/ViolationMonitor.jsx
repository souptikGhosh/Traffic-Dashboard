import React from 'react';
import { useTraffic } from './TrafficContext';

function ViolationMonitor({ isDarkMode }) {
  const { intersections, recordViolation } = useTraffic();

  const violationTypes = [
    'Red Light Violation',
    'Speeding',
    'Wrong Way',
    'No Parking'
  ];

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Traffic Violations
      </h2>
      <div className="space-y-4">
        {intersections.map((intersection) => (
          <div 
            key={intersection.id}
            className={`p-3 rounded-lg border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {intersection.name}
                </span>
                <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                  intersection.violations > 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {intersection.violations} violations
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {violationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => recordViolation(intersection.id, type)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Record {type}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViolationMonitor; 