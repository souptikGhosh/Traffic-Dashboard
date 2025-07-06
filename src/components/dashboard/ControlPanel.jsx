import React, { useState } from 'react';
import { useTraffic } from '../TrafficContext';

function ControlPanel({ isDarkMode }) {
  const [controlMode, setControlMode] = useState('auto');
  const { emergencyRoute, setEmergencyRoute, visibleIntersections, updateIntersectionTimer } = useTraffic();

  const handleEmergencyRoute = () => {
    setEmergencyRoute(true);
    // In a real application, this would trigger emergency route calculations
    setTimeout(() => setEmergencyRoute(false), 3000); // Reset after 3 seconds
  };

  const addExtraTime = (intersectionId) => {
    const intersection = visibleIntersections.find(i => i.id === intersectionId);
    if (intersection && intersection.isGreen) {
      updateIntersectionTimer(intersectionId, intersection.timer + 5);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 mb-6 smooth-transition hover:scale-[1.02] ${
      isDarkMode ? 'dark:bg-gray-800 dark:shadow-gray-700' : 'shadow-gray-200'
    }`}>
      <h2 className={`text-lg font-semibold mb-4 smooth-transition ${
        isDarkMode ? 'dark:text-white' : 'text-gray-700'
      }`}>
        Control Panel
      </h2>
      
      <div className="space-y-4">
        {/* Emergency Route Button */}
        <button
          onClick={handleEmergencyRoute}
          className={`w-full p-3 rounded-lg text-white font-medium smooth-transition
            ${emergencyRoute 
              ? 'bg-red-600 animate-pulse' 
              : 'bg-red-500 hover:bg-red-600'
            }`}
        >
          {emergencyRoute ? 'Calculating Emergency Route...' : 'Emergency Route'}
        </button>

        {/* Manual/Auto Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setControlMode('manual')}
            className={`p-3 rounded-lg font-medium smooth-transition
              ${controlMode === 'manual'
                ? 'bg-yellow-500 text-white'
                : isDarkMode 
                  ? 'bg-yellow-900 text-yellow-200 hover:bg-yellow-800'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
          >
            Manual Control
          </button>

          <button
            onClick={() => setControlMode('auto')}
            className={`p-3 rounded-lg font-medium smooth-transition
              ${controlMode === 'auto'
                ? 'bg-green-500 text-white'
                : isDarkMode
                  ? 'bg-green-900 text-green-200 hover:bg-green-800'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
          >
            Auto Control
          </button>
        </div>

        {/* Manual Timer Controls */}
        {controlMode === 'manual' && (
          <div className="space-y-3">
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Add 5 seconds to green signal:
            </h3>
            {visibleIntersections.map(intersection => (
              <button
                key={intersection.id}
                onClick={() => addExtraTime(intersection.id)}
                disabled={!intersection.isGreen}
                className={`w-full p-2 rounded-lg text-sm font-medium smooth-transition
                  ${intersection.isGreen
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {intersection.name} {intersection.isGreen ? `(${intersection.timer}s)` : '(Red)'}
              </button>
            ))}
          </div>
        )}

        {/* Status Indicator */}
        <div className="text-center mt-4">
          <span className={`text-sm font-medium smooth-transition ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Current Mode: {' '}
            <span className={`smooth-transition ${
              controlMode === 'auto' 
                ? isDarkMode ? 'text-green-400' : 'text-green-600'
                : isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {controlMode === 'auto' ? 'Automatic' : 'Manual'} Control
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel; 