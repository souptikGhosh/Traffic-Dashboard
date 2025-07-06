import React from 'react';
import { useTraffic } from './TrafficContext';

function SignalStatus({ isDarkMode }) {
  const { intersections } = useTraffic();

  // Sort intersections by count (highest first) for display priority
  const sortedIntersections = [...intersections].sort((a, b) => b.count - a.count);

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Signal Status
      </h2>
      <div className="space-y-4">
        {sortedIntersections.map((intersection) => (
          <div key={intersection.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {intersection.name}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {intersection.count} vehicles {intersection.isGreen ? '• Flowing' : '• Waiting'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  intersection.isGreen 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-red-500'
                }`} />
                {intersection.isGreen && (
                  <span className={`text-lg font-semibold ${
                    intersection.timer <= 10
                      ? 'text-yellow-500 dark:text-yellow-400'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {intersection.timer}s
                  </span>
                )}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  intersection.isGreen ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: intersection.isGreen ? `${(intersection.timer / 45) * 100}%` : '100%'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignalStatus; 