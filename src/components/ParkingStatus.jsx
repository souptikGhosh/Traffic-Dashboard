import React from 'react';
import { useTraffic } from './TrafficContext';

function ParkingStatus({ isDarkMode }) {
  const { intersections, updateParkingAvailability } = useTraffic();

  const getStatusColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage < 20) return {
      bg: isDarkMode ? 'bg-red-900/50' : 'bg-red-100',
      text: isDarkMode ? 'text-red-200' : 'text-red-800'
    };
    if (percentage < 50) return {
      bg: isDarkMode ? 'bg-yellow-900/50' : 'bg-yellow-100',
      text: isDarkMode ? 'text-yellow-200' : 'text-yellow-800'
    };
    return {
      bg: isDarkMode ? 'bg-green-900/50' : 'bg-green-100',
      text: isDarkMode ? 'text-green-200' : 'text-green-800'
    };
  };

  const handleSpotChange = (intersectionId, change) => {
    const intersection = intersections.find(i => i.id === intersectionId);
    if (intersection) {
      const newAvailable = Math.max(0, Math.min(
        intersection.parkingAvailable + change,
        intersection.parkingSpots
      ));
      updateParkingAvailability(intersectionId, newAvailable);
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Parking Status
      </h2>
      <div className="space-y-4">
        {intersections.map((intersection) => {
          const colors = getStatusColor(intersection.parkingAvailable, intersection.parkingSpots);
          return (
            <div 
              key={intersection.id}
              className={`p-3 rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {intersection.name}
                </span>
                <div className={`px-3 py-1 rounded-lg ${colors.bg} ${colors.text}`}>
                  {intersection.parkingAvailable} / {intersection.parkingSpots}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    intersection.parkingAvailable < intersection.parkingSpots * 0.2
                      ? 'bg-red-500'
                      : intersection.parkingAvailable < intersection.parkingSpots * 0.5
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{
                    width: `${(intersection.parkingAvailable / intersection.parkingSpots) * 100}%`
                  }}
                />
              </div>
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => handleSpotChange(intersection.id, -1)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-red-900/30 hover:bg-red-900/50 text-red-200'
                      : 'bg-red-100 hover:bg-red-200 text-red-800'
                  }`}
                >
                  Occupy Spot
                </button>
                <button
                  onClick={() => handleSpotChange(intersection.id, 1)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-green-900/30 hover:bg-green-900/50 text-green-200'
                      : 'bg-green-100 hover:bg-green-200 text-green-800'
                  }`}
                >
                  Free Spot
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ParkingStatus; 