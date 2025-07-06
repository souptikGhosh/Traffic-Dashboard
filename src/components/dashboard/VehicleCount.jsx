import React from 'react';
import { useTraffic } from '../TrafficContext';

function VehicleCount({ isDarkMode }) {
  const { visibleIntersections } = useTraffic();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 mb-6 smooth-transition hover:scale-[1.02] ${
      isDarkMode ? 'dark:bg-gray-800 dark:shadow-gray-700' : 'shadow-gray-200'
    }`}>
      <h2 className={`text-lg font-semibold mb-4 smooth-transition ${
        isDarkMode ? 'dark:text-white' : 'text-gray-700'
      }`}>
        Vehicle Count
      </h2>
      <div className="space-y-4">
        {visibleIntersections.map((intersection) => (
          <div 
            key={intersection.id}
            className={`flex items-center justify-between p-3 rounded-lg smooth-transition ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            } ${
              intersection.isGreen ? 'scale-[1.02] border-l-4 border-green-500' : ''
            }`}
          >
            <div className="flex-1">
              <h3 className={`font-medium smooth-transition ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {intersection.name}
              </h3>
              <div className="flex items-center mt-2 relative">
                <div className="w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
                  <div 
                    className={`h-2 rounded-full smooth-transition ${
                      intersection.count > 40 ? 'bg-red-400' :
                      intersection.count > 20 ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{ 
                      width: `${Math.min((intersection.count / 50) * 100, 100)}%`,
                      transition: 'width 1s ease-in-out, background-color 0.5s ease'
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 text-center min-w-[80px]">
              <div className={`text-2xl font-bold smooth-transition ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              } ${
                intersection.isGreen ? 'text-green-500' : ''
              }`}>
                {intersection.count}
              </div>
              <div className={`text-xs mt-1 font-medium smooth-transition ${
                intersection.isGreen 
                  ? 'text-green-500 animate-pulse' 
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {intersection.isGreen ? 'Clear' : 'Waiting'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleCount; 