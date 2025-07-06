import React, { useState } from 'react';
import { useTraffic } from '../TrafficContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function TrafficTrends({ isDarkMode }) {
  const { visibleIntersections, trafficTrends } = useTraffic();
  const [selectedIntersection, setSelectedIntersection] = useState(null);

  // Initialize selectedIntersection if not set and we have intersections
  if (!selectedIntersection && visibleIntersections.length > 0) {
    setSelectedIntersection(visibleIntersections[0].name);
  }

  const getChartColor = (count) => {
    if (count > 70) return '#ef4444';
    if (count > 40) return '#f97316';
    return '#22c55e';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const count = payload[0].value;
      const color = getChartColor(count);
      return (
        <div className={`p-3 rounded-lg shadow-lg smooth-transition ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
          <p className="font-semibold">{label}</p>
          <p className="flex items-center">
            Vehicles: <span className="ml-2 font-bold" style={{ color }}>
              {count}
            </span>
          </p>
          <p className="text-sm mt-1" style={{ color }}>
            {count > 70 ? 'Heavy Traffic' : count > 40 ? 'Moderate Traffic' : 'Light Traffic'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Convert hourly data to chart format
  const getChartData = (intersection) => {
    const trend = trafficTrends.find(t => t.name === intersection);
    if (!trend) return [];

    return trend.hourlyData.map((count, hour) => ({
      time: `${hour}:00`,
      count: count
    }));
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 mb-6 smooth-transition hover:scale-[1.02] ${
      isDarkMode ? 'dark:bg-gray-800 dark:shadow-gray-700' : 'shadow-gray-200'
    }`}>
      <h2 className={`text-lg font-semibold mb-4 smooth-transition ${
        isDarkMode ? 'dark:text-white' : 'text-gray-700'
      }`}>
        Traffic Trends
      </h2>
      
      <select
        className={`w-full p-2 mb-4 border rounded-md smooth-transition ${
          isDarkMode 
            ? 'dark:bg-gray-700 dark:text-white dark:border-gray-600' 
            : 'bg-white text-gray-700'
        }`}
        value={selectedIntersection || ''}
        onChange={(e) => setSelectedIntersection(e.target.value)}
      >
        {visibleIntersections.map(intersection => (
          <option key={intersection.id} value={intersection.name}>
            {intersection.name}
          </option>
        ))}
      </select>

      <div className="h-64 w-full">
        {selectedIntersection && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getChartData(selectedIntersection)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="time" 
                stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
              />
              <YAxis 
                stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
                label={{ 
                  value: 'Vehicle Count', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: isDarkMode ? '#9ca3af' : '#4b5563' }
                }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Vehicles"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{
                  fill: (entry) => getChartColor(entry.value),
                  stroke: 'none',
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  fill: (entry) => getChartColor(entry.value),
                  stroke: 'white',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TrafficTrends; 