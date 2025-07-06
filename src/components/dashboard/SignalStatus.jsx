import React, { useEffect } from 'react';
import { useTraffic } from '../TrafficContext';

function SignalStatus({ isDarkMode }) {
  const { visibleIntersections, updateIntersectionCount } = useTraffic();

  useEffect(() => {
    // Reset vehicle count for intersections with green signal
    visibleIntersections.forEach(intersection => {
      if (intersection.isGreen) {
        updateIntersectionCount(intersection.id, 0);
      }
    });
  }, [visibleIntersections, updateIntersectionCount]);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 mb-6 smooth-transition hover:scale-[1.02] ${
      isDarkMode ? 'dark:bg-gray-800 dark:shadow-gray-700' : 'shadow-gray-200'
    }`}>
      <h2 className={`text-lg font-semibold mb-4 smooth-transition ${
        isDarkMode ? 'dark:text-white' : 'text-gray-700'
      }`}>
        Signal Status
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {visibleIntersections.map((intersection) => (
          <div 
            key={intersection.id}
            className={`p-4 rounded-lg smooth-transition ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            } ${
              intersection.isGreen ? 'scale-[1.02]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium smooth-transition ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {intersection.name}
                </h3>
                <div className={`text-sm mt-1 smooth-transition ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {intersection.isGreen ? 'Traffic flowing' : 'Traffic stopped'}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full smooth-transition ${
                  intersection.isGreen 
                    ? 'bg-green-500 animate-pulse scale-110' 
                    : 'bg-red-500'
                }`} />
                <div className={`text-2xl font-bold smooth-transition ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {intersection.isGreen ? intersection.timer : '00'}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 relative h-2">
              <div className="w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-600">
                <div 
                  className={`h-2 rounded-full smooth-transition ${
                    intersection.isGreen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: intersection.isGreen ? `${(intersection.timer / 45) * 100}%` : '100%'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SignalStatus; 