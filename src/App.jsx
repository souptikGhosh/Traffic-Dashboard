import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { TrafficProvider } from './components/TrafficContext';
import TrafficMap from './components/TrafficMap';
import VehicleCount from './components/dashboard/VehicleCount';
import SignalStatus from './components/dashboard/SignalStatus';
import TrafficTrends from './components/dashboard/TrafficTrends';
import ControlPanel from './components/dashboard/ControlPanel';
import EmergencyControls from './components/EmergencyControls';
import ViolationMonitor from './components/ViolationMonitor';
import ParkingStatus from './components/ParkingStatus';
import Notifications from './components/Notifications';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedComponent, setExpandedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('main'); // 'main' or 'advanced'
  const [isLoading, setIsLoading] = useState(true);

  // Update HTML class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-900');
    }
  }, [isDarkMode]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (componentName) => {
    setExpandedComponent(expandedComponent === componentName ? null : componentName);
  };

  const ComponentWrapper = ({ title, children, name }) => {
    const isExpanded = expandedComponent === name;
    return (
      <div 
        className={`relative smooth-transition ${
          isExpanded ? 'fixed inset-0 z-50 m-4' : 'h-full'
        }`}
      >
        <div 
          className={`${
            isExpanded 
              ? 'absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-auto'
              : 'h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={() => toggleExpand(name)}
              className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 smooth-transition"
            >
              {isExpanded ? 'Minimize' : 'Expand'}
            </button>
          </div>
          <div className={`${
            isExpanded 
              ? 'p-4 h-[calc(100%-4rem)]' 
              : 'p-4 h-[calc(100%-4rem)] overflow-y-auto'
          }`}>
            {children}
          </div>
        </div>
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 -z-10"
            onClick={() => toggleExpand(name)}
          />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-300">
          Loading Traffic Management System...
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TrafficProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-4">
            <header className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Kolkata Traffic Management
                </h1>
                <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('main')}
                    className={`px-4 py-2 smooth-transition ${
                      activeTab === 'main'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Main View
                  </button>
                  <button
                    onClick={() => setActiveTab('advanced')}
                    className={`px-4 py-2 smooth-transition ${
                      activeTab === 'advanced'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Advanced Controls
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 smooth-transition shadow-sm"
              >
                {isDarkMode ? '🌞 Light' : '🌙 Dark'}
              </button>
            </header>

            {activeTab === 'main' ? (
              <div className="h-[calc(100vh-8rem)] grid grid-rows-[1fr,auto] gap-8">
                {/* Top Section - Map and Traffic Trends */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Map Section - 2/3 width */}
                  <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[52vh]">
                      <TrafficMap isDarkMode={isDarkMode} />
                    </div>
                  </div>

                  {/* Traffic Trends - 1/3 width */}
                  <div className="col-span-1 h-[52vh]">
                    <ComponentWrapper title="Traffic Trends" name="trends">
                      <TrafficTrends isDarkMode={isDarkMode} />
                    </ComponentWrapper>
                  </div>
                </div>

                {/* Bottom Section - Vehicle Count, Signal Status, Control Panel */}
                <div className="grid grid-cols-3 gap-6 h-[33vh]">
                  <div className="col-span-1">
                    <ComponentWrapper title="Vehicle Count" name="vehicles">
                      <VehicleCount isDarkMode={isDarkMode} />
                    </ComponentWrapper>
                  </div>
                  <div className="col-span-1">
                    <ComponentWrapper title="Signal Status" name="signals">
                      <SignalStatus isDarkMode={isDarkMode} />
                    </ComponentWrapper>
                  </div>
                  <div className="col-span-1">
                    <ComponentWrapper title="Control Panel" name="control">
                      <ControlPanel isDarkMode={isDarkMode} />
                    </ComponentWrapper>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100vh-8rem)] grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ComponentWrapper title="Emergency Controls" name="emergency">
                    <EmergencyControls isDarkMode={isDarkMode} />
                  </ComponentWrapper>
                  <ComponentWrapper title="Violation Monitor" name="violations">
                    <ViolationMonitor isDarkMode={isDarkMode} />
                  </ComponentWrapper>
                </div>
                <div className="space-y-6">
                  <ComponentWrapper title="Parking Status" name="parking">
                    <ParkingStatus isDarkMode={isDarkMode} />
                  </ComponentWrapper>
                  <ComponentWrapper title="Notifications" name="notifications">
                    <Notifications isDarkMode={isDarkMode} />
                  </ComponentWrapper>
                </div>
              </div>
            )}
          </div>
        </div>
      </TrafficProvider>
    </ThemeProvider>
  );
}

export default App; 