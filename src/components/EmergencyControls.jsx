import React from 'react';
import { useTraffic } from './TrafficContext';

function EmergencyControls({ isDarkMode }) {
  const { visibleIntersections, reportEmergencyVehicle, emergencyRoute, setEmergencyRoute } = useTraffic();

  const handleEmergencyRoute = () => {
    setEmergencyRoute(true);
    // In a real application, this would trigger emergency route calculations
    setTimeout(() => setEmergencyRoute(false), 5000); // Reset after 5 seconds
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Emergency Vehicle Control
      </h2>

      {/* Emergency Route Button */}
      <button
        onClick={handleEmergencyRoute}
        className={`w-full p-3 mb-4 rounded-lg text-white font-medium smooth-transition
          ${emergencyRoute 
            ? 'bg-red-600 animate-pulse' 
            : 'bg-red-500 hover:bg-red-600'
          }`}
      >
        {emergencyRoute ? 'Calculating Emergency Route...' : 'Activate Emergency Route'}
      </button>

      <div className="space-y-3">
        {visibleIntersections.map((intersection) => (
          <div 
            key={intersection.id}
            className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${
              intersection.hasEmergencyVehicle 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex flex-col">
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {intersection.name}
              </span>
              <span className={`text-sm ${
                intersection.hasEmergencyVehicle
                  ? 'text-red-600 dark:text-red-400'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {intersection.hasEmergencyVehicle ? 'Emergency Vehicle Present' : 'No Emergency'}
              </span>
            </div>
            <button
              onClick={() => reportEmergencyVehicle(intersection.id, !intersection.hasEmergencyVehicle)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                intersection.hasEmergencyVehicle
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {intersection.hasEmergencyVehicle ? 'Clear Emergency' : 'Report Emergency'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmergencyControls; 