import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTraffic } from './TrafficContext';

// Custom hook to track map bounds and update visible intersections
function MapEventsHandler() {
  const { updateVisibleIntersections } = useTraffic();
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      updateVisibleIntersections({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    }
  });

  // Initial bounds check
  useEffect(() => {
    const bounds = map.getBounds();
    updateVisibleIntersections({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    });
  }, [map, updateVisibleIntersections]);

  return null;
}

function TrafficMap({ isDarkMode }) {
  const { visibleIntersections, allIntersections, emergencyRoute } = useTraffic();
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Set a small delay to ensure the map is properly mounted
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 500); // Increased delay to ensure map is fully mounted

    return () => clearTimeout(timer);
  }, []);

  const getIntersectionColor = (intersection) => {
    const isVisible = visibleIntersections.some(vi => vi.id === intersection.id);
    if (!isVisible) return '#718096'; // gray for non-visible intersections

    if (intersection.hasEmergencyVehicle) return '#ef4444'; // red for emergency
    if (intersection.isGreen) return '#22c55e'; // green
    if (intersection.count > 30) return '#ef4444'; // red
    if (intersection.count > 15) return '#f97316'; // orange
    return '#eab308'; // yellow
  };

  // Calculate emergency route path
  const getEmergencyPath = () => {
    const emergencyIntersection = visibleIntersections.find(i => i.hasEmergencyVehicle);
    if (!emergencyIntersection) return null;

    // Find nearest hospital or destination (simulated)
    const destination = allIntersections.reduce((nearest, current) => {
      if (nearest === null) return current;
      const currentDist = Math.sqrt(
        Math.pow(current.position[0] - emergencyIntersection.position[0], 2) +
        Math.pow(current.position[1] - emergencyIntersection.position[1], 2)
      );
      const nearestDist = Math.sqrt(
        Math.pow(nearest.position[0] - emergencyIntersection.position[0], 2) +
        Math.pow(nearest.position[1] - emergencyIntersection.position[1], 2)
      );
      return currentDist < nearestDist ? current : nearest;
    }, null);

    return destination ? [emergencyIntersection.position, destination.position] : null;
  };

  if (!isMapReady) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-gray-600 dark:text-gray-300">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[22.5726, 88.3639]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      
      <MapEventsHandler />

      {allIntersections.map((intersection) => {
        const isVisible = visibleIntersections.some(vi => vi.id === intersection.id);
        const visibleIntersection = visibleIntersections.find(vi => vi.id === intersection.id);
        const color = getIntersectionColor(visibleIntersection || intersection);
        
        return (
          <Circle
            key={intersection.id}
            center={intersection.position}
            radius={100}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: isVisible ? 0.7 : 0.2,
            }}
          >
            <Popup>
              <div className="p-2 text-gray-800">
                <h3 className="font-semibold">{intersection.name}</h3>
                {isVisible ? (
                  <>
                    <p>Vehicles: {visibleIntersection.count}</p>
                    <p>Status: {visibleIntersection.isGreen ? 'Green' : 'Red'}</p>
                    {visibleIntersection.hasEmergencyVehicle && (
                      <p className="text-red-600 font-semibold">Emergency Vehicle Present</p>
                    )}
                  </>
                ) : (
                  <p>Outside current monitoring area</p>
                )}
              </div>
            </Popup>
          </Circle>
        );
      })}

      {/* Emergency Route Path */}
      {emergencyRoute && getEmergencyPath() && (
        <Polyline
          positions={getEmergencyPath()}
          pathOptions={{
            color: '#ef4444',
            weight: 4,
            dashArray: '10, 10',
            opacity: 0.8,
            animate: true
          }}
        />
      )}
    </MapContainer>
  );
}

export default TrafficMap; 