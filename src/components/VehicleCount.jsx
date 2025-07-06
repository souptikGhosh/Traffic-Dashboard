import React, { useEffect } from 'react';
import { useTraffic } from './TrafficContext';

function VehicleCount({ isDarkMode }) {
  const { intersections, updateIntersectionCount } = useTraffic();

  // Effect to reset count when signal turns green
  useEffect(() => {
    intersections.forEach(intersection => {
      if (intersection.isGreen) {
        updateIntersectionCount(intersection.id, 0);
      }
    });
  }, [intersections, updateIntersectionCount]);

  const getCountColor = (count) => {
    if (count > 40) return {
      bg: isDarkMode ? 'bg-red-900/50' : 'bg-red-100',
      text: isDarkMode ? 'text-red-200' : 'text-red-800',
      border: isDarkMode ? 'border-red-700' : 'border-red-200'
    };
    if (count > 20) return {
      bg: isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100',
      text: isDarkMode ? 'text-yellow-200' : 'text-yellow-800',
      border: isDarkMode ? 'border-yellow-700' : 'border-yellow-200'
    };
    return {
      bg: isDarkMode ? 'bg-green-900/50' : 'bg-green-100',
      text: isDarkMode ? 'text-green-200' : 'text-green-800',
      border: isDarkMode ? 'border-green-700' : 'border-green-200'
    };
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Vehicle Count
      </h2>
      <div className="space-y-3">
        {intersections.map((intersection) => {
          const colors = getCountColor(intersection.count);
          return (
            <div 
              key={intersection.id} 
              className="flex justify-between items-center p-2 rounded-lg border transition-all duration-300"
              style={{ borderColor: colors.border.split(' ')[1] }}
            >
              <div className="flex flex-col">
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {intersection.name}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {intersection.isGreen ? 'Moving' : 'Waiting'}
                </span>
              </div>
              <div className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${colors.bg} ${colors.text}
              `}>
                {intersection.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VehicleCount; 