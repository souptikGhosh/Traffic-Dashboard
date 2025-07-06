import React, { useState, useCallback } from 'react';
import { useTraffic } from './TrafficContext';

function ControlPanel({ isDarkMode }) {
  const { intersections, updateIntersectionTimer } = useTraffic();
  const [mode, setMode] = useState('auto');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedIntersection, setSelectedIntersection] = useState('');

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'auto') {
      setSelectedIntersection('');
    }
  };

  const handleTimerAdjustment = useCallback((seconds) => {
    if (!selectedIntersection) return;
    
    const intersection = intersections.find(i => i.id === parseInt(selectedIntersection));
    if (!intersection) return;

    const newTimer = Math.max(5, Math.min(60, intersection.timer + seconds));
    updateIntersectionTimer(intersection.id, newTimer);
  }, [selectedIntersection, intersections, updateIntersectionTimer]);

  return (
    <div className={`p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Control Panel
      </h2>
      
      <div className="space-y-4">
        {/* Mode Selection */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Operation Mode
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleModeChange('auto')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                mode === 'auto'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Auto
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                mode === 'manual'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Emergency Override */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Emergency Override
          </h3>
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              emergencyMode
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {emergencyMode ? 'Deactivate Emergency Mode' : 'Activate Emergency Mode'}
          </button>
        </div>

        {/* Manual Control Section */}
        {mode === 'manual' && (
          <div className="space-y-4">
            <div>
              <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Manual Control
              </h3>
              <select
                value={selectedIntersection}
                onChange={(e) => setSelectedIntersection(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                <option value="">Select Intersection</option>
                {intersections.map(intersection => (
                  <option key={intersection.id} value={intersection.id}>
                    {intersection.name} ({intersection.count} vehicles)
                  </option>
                ))}
              </select>

              {selectedIntersection && (
                <div className="mt-4">
                  <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Timer Adjustment
                  </h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTimerAdjustment(-5)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      -5s
                    </button>
                    <button
                      onClick={() => handleTimerAdjustment(5)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      +5s
                    </button>
                  </div>
                  {intersections.find(i => i.id === parseInt(selectedIntersection)) && (
                    <div className={`text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Current Timer: {intersections.find(i => i.id === parseInt(selectedIntersection)).timer}s
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="flex items-center justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            System Status
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            emergencyMode
              ? 'bg-red-100 text-red-800'
              : mode === 'manual'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {emergencyMode ? 'Emergency' : mode === 'manual' ? 'Manual' : 'Auto'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel; 