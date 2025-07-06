import React, { createContext, useContext, useState, useEffect } from 'react';

const TrafficContext = createContext();

// All possible intersections in Kolkata
const allIntersections = [
  { id: 1, name: 'Park Street-Chowringhee', position: [22.5551, 88.3489], count: 15, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 120, parkingAvailable: 80 },
  { id: 2, name: 'Esplanade', position: [22.5558, 88.3519], count: 25, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 150, parkingAvailable: 100 },
  { id: 3, name: 'Dharmatala', position: [22.5604, 88.3502], count: 30, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 80, parkingAvailable: 45 },
  { id: 4, name: 'Park Circus', position: [22.5397, 88.3693], count: 20, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 100, parkingAvailable: 60 },
  { id: 5, name: 'Shyambazar', position: [22.5957, 88.3732], count: 10, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 90, parkingAvailable: 50 },
  { id: 6, name: 'Gariahat', position: [22.5174, 88.3679], count: 18, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 110, parkingAvailable: 70 },
  { id: 7, name: 'Sealdah', position: [22.5676, 88.3675], count: 22, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 130, parkingAvailable: 85 },
  { id: 8, name: 'Howrah Bridge', position: [22.5839, 88.3437], count: 35, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 200, parkingAvailable: 140 },
  { id: 9, name: 'Ultadanga', position: [22.5895, 88.3889], count: 28, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 95, parkingAvailable: 55 },
  { id: 10, name: 'Jadavpur', position: [22.4977, 88.3714], count: 15, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 85, parkingAvailable: 40 },
  { id: 11, name: 'Salt Lake', position: [22.5697, 88.4115], count: 20, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 160, parkingAvailable: 110 },
  { id: 12, name: 'Behala', position: [22.4843, 88.3113], count: 12, isGreen: false, timer: 45, hasEmergencyVehicle: false, violations: 0, parkingSpots: 75, parkingAvailable: 35 }
].map(intersection => ({
  ...intersection,
  trend: 'stable',
  percentage: 0,
  hourlyData: Array(24).fill(0).map(() => Math.floor(Math.random() * 30)),
  predictedCount: 0,
  lastGreenTime: null
}));

export function TrafficProvider({ children }) {
  const [visibleIntersections, setVisibleIntersections] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [emergencyRoute, setEmergencyRoute] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [trafficTrends, setTrafficTrends] = useState(
    allIntersections.map(intersection => ({
      id: intersection.id,
      name: intersection.name,
      trend: 'stable',
      percentage: 0,
      hourlyData: intersection.hourlyData
    }))
  );

  // Function to update intersection timer
  const updateIntersectionTimer = (intersectionId, newTimer) => {
    setVisibleIntersections(prevIntersections => 
      prevIntersections.map(intersection => 
        intersection.id === intersectionId
          ? { ...intersection, timer: newTimer }
          : intersection
      )
    );
  };

  // Function to update intersection count
  const updateIntersectionCount = (intersectionId, newCount) => {
    setVisibleIntersections(prevIntersections =>
      prevIntersections.map(intersection => {
        if (intersection.id === intersectionId) {
          // If signal is green, force count to 0
          if (intersection.isGreen) {
            return { ...intersection, count: 0 };
          }
          return { ...intersection, count: Math.min(Math.max(0, newCount), 40) };
        }
        return intersection;
      })
    );
  };

  // Function to handle emergency vehicles
  const reportEmergencyVehicle = (intersectionId, hasEmergency) => {
    setVisibleIntersections(prevIntersections =>
      prevIntersections.map(intersection => {
        if (intersection.id === intersectionId) {
          const updatedIntersection = { 
            ...intersection, 
            hasEmergencyVehicle: hasEmergency,
            isGreen: hasEmergency ? true : intersection.isGreen,
            timer: hasEmergency ? 45 : intersection.timer
          };
          // Add notification
          if (hasEmergency) {
            addNotification(`Emergency vehicle reported at ${intersection.name}`);
          }
          return updatedIntersection;
        }
        return intersection;
      })
    );
  };

  // Function to update parking availability
  const updateParkingAvailability = (intersectionId, spotsAvailable) => {
    setVisibleIntersections(prevIntersections =>
      prevIntersections.map(intersection => {
        if (intersection.id === intersectionId) {
          const updatedIntersection = {
            ...intersection,
            parkingAvailable: Math.max(0, Math.min(spotsAvailable, intersection.parkingSpots))
          };
          // Notify if parking is getting full
          if (spotsAvailable < intersection.parkingSpots * 0.1) {
            addNotification(`Parking at ${intersection.name} is nearly full`);
          }
          return updatedIntersection;
        }
        return intersection;
      })
    );
  };

  // Function to record traffic violations
  const recordViolation = (intersectionId, violationType) => {
    setVisibleIntersections(prevIntersections =>
      prevIntersections.map(intersection => {
        if (intersection.id === intersectionId) {
          const updatedIntersection = {
            ...intersection,
            violations: intersection.violations + 1
          };
          addNotification(`Traffic violation detected at ${intersection.name}: ${violationType}`);
          return updatedIntersection;
        }
        return intersection;
      })
    );
  };

  // Function to add notifications
  const addNotification = (message) => {
    setNotifications(prev => [{
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 10)); // Keep only last 10 notifications
  };

  // Function to update visible intersections
  const updateVisibleIntersections = (bounds) => {
    if (!bounds) return;
    
    const inBoundsIntersections = allIntersections.filter(intersection => {
      const [lat, lng] = intersection.position;
      return lat >= bounds.south && lat <= bounds.north && 
             lng >= bounds.west && lng <= bounds.east;
    });

    let selectedIntersections = inBoundsIntersections;
    if (inBoundsIntersections.length > 5) {
      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east + bounds.west) / 2;

      selectedIntersections = inBoundsIntersections
        .map(intersection => ({
          ...intersection,
          distance: Math.sqrt(
            Math.pow(intersection.position[0] - centerLat, 2) + 
            Math.pow(intersection.position[1] - centerLng, 2)
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
        .map(({ distance, ...intersection }) => intersection);
    }

    setVisibleIntersections(prevIntersections => {
      const updatedIntersections = selectedIntersections.map(intersection => {
        const existing = prevIntersections.find(vi => vi.id === intersection.id);
        if (existing) {
          return {
            ...intersection,
            count: existing.count,
            isGreen: existing.isGreen,
            timer: existing.timer
          };
        }
        return intersection;
      });

      if (!isInitialized && updatedIntersections.length > 0) {
        // Find intersection with highest count to start
        const maxCountIntersection = updatedIntersections.reduce((max, curr) => 
          curr.count > max.count ? curr : max
        , updatedIntersections[0]);
        
        maxCountIntersection.isGreen = true;
        setIsInitialized(true);
      }

      return updatedIntersections;
    });
  };

  // Timer effect for signal changes and vehicle count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIntersections(prevIntersections => {
        if (!prevIntersections.length) return prevIntersections;

        const updatedIntersections = prevIntersections.map(intersection => {
          let { isGreen, timer, count, hasEmergencyVehicle } = intersection;

          // If there's an emergency vehicle, keep signal green
          if (hasEmergencyVehicle) {
            return {
              ...intersection,
              isGreen: true,
              timer: Math.max(timer, 30), // Ensure sufficient time for emergency vehicle
              count: 0 // Keep count at 0 for emergency situations
            };
          }

          // Update timer if signal is green
          if (isGreen) {
            timer -= 1;
            count = 0; // Force count to 0 while signal is green
          } else {
            // Accumulate vehicles at red signals more gradually
            if (Math.random() < 0.2) {
              count = Math.min(40, count + 1);
            }
          }

          // Predict next hour's traffic
          const currentHour = new Date().getHours();
          const predictedCount = Math.floor(
            (intersection.hourlyData[currentHour] + 
             intersection.hourlyData[(currentHour + 1) % 24]) / 2
          );

          return {
            ...intersection,
            isGreen,
            timer,
            count,
            predictedCount
          };
        });

        // Check if we need to switch signals
        const currentGreen = updatedIntersections.find(int => int.isGreen);
        if (!currentGreen || currentGreen.timer <= 0) {
          // Find intersection with highest vehicle count or emergency vehicle
          const nextGreen = updatedIntersections.reduce((max, curr) => {
            if (curr.hasEmergencyVehicle) return curr;
            return !curr.isGreen && curr.count > (max?.count || -1) ? curr : max;
          }, null);

          if (nextGreen) {
            // Reset all signals to red
            updatedIntersections.forEach(int => {
              int.isGreen = false;
              int.timer = 45;
            });

            // Set new green signal
            const intersection = updatedIntersections.find(int => int.id === nextGreen.id);
            if (intersection) {
              intersection.isGreen = true;
              intersection.timer = 45;
              intersection.count = 0;
            }
          }
        }

        return updatedIntersections;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    visibleIntersections,
    allIntersections,
    updateVisibleIntersections,
    updateIntersectionTimer,
    updateIntersectionCount,
    reportEmergencyVehicle,
    updateParkingAvailability,
    recordViolation,
    notifications,
    addNotification,
    trafficTrends,
    emergencyRoute,
    setEmergencyRoute
  };

  return (
    <TrafficContext.Provider value={contextValue}>
      {children}
    </TrafficContext.Provider>
  );
}

export function useTraffic() {
  const context = useContext(TrafficContext);
  if (context === undefined) {
    throw new Error('useTraffic must be used within a TrafficProvider');
  }
  return context;
} 