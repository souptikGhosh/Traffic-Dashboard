import React, { useMemo } from 'react';
import { useTraffic } from './TrafficContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrafficTrends({ isDarkMode }) {
  const { trafficTrends, intersections } = useTraffic();
  
  // Filter trends for visible intersections only
  const visibleTrends = trafficTrends.filter(trend => 
    intersections.some(intersection => intersection.id === trend.id)
  );

  // Calculate statistics for each intersection
  const trendStats = useMemo(() => {
    return visibleTrends.map(trend => {
      const currentCount = intersections.find(i => i.id === trend.id)?.count || 0;
      const hourlyData = trend.hourlyData;
      const lastHourIndex = new Date().getHours();
      const lastHourValue = hourlyData[lastHourIndex];
      const prevHourValue = hourlyData[(lastHourIndex - 1 + 24) % 24];
      
      // Calculate percentage change
      const change = lastHourValue - prevHourValue;
      const percentageChange = prevHourValue !== 0 
        ? ((change / prevHourValue) * 100).toFixed(1)
        : 0;
      
      // Determine trend direction
      const trendDirection = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';
      
      return {
        ...trend,
        currentCount,
        percentageChange: Number(percentageChange),
        trend: trendDirection
      };
    });
  }, [visibleTrends, intersections]);

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
        return isDarkMode ? 'text-red-400' : 'text-red-500';
      case 'decreasing':
        return isDarkMode ? 'text-green-400' : 'text-green-500';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return '↑';
      case 'decreasing':
        return '↓';
      default:
        return '→';
    }
  };

  const getLineColor = (index, isDarkMode) => {
    const colors = isDarkMode 
      ? ['#22c55e', '#3b82f6', '#f97316', '#ef4444']
      : ['#16a34a', '#2563eb', '#ea580c', '#dc2626'];
    return colors[index % colors.length];
  };

  if (trendStats.length === 0) {
    return (
      <div className={`h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
        <p>No traffic data available</p>
      </div>
    );
  }

  // Chart data configuration
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: trendStats.map((trend, index) => ({
      label: trend.name,
      data: trend.hourlyData,
      borderColor: getLineColor(index, isDarkMode),
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 4,
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#374151' : 'white',
        titleColor: isDarkMode ? '#e5e7eb' : '#111827',
        bodyColor: isDarkMode ? '#e5e7eb' : '#111827',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value} vehicles`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#4b5563',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        }
      },
      y: {
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#4b5563',
        },
        min: 0,
        max: Math.max(...trendStats.flatMap(t => t.hourlyData)) + 5,
        beginAtZero: true
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Traffic Graph */}
      <div className="h-1/2 p-4">
        <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Traffic Flow - Last 24 Hours
        </h3>
        <div className="h-[calc(100%-2rem)]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Current Trends - No scroll */}
      <div className="h-1/2 p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Current Trends
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {trendStats.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex justify-between items-center p-2 rounded ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              style={{
                borderLeft: `3px solid ${getLineColor(index, isDarkMode)}`
              }}
            >
              <div className="flex flex-col">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                  {item.name}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.currentCount} vehicles
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={getTrendColor(item.trend)}>
                  {getTrendIcon(item.trend)}
                </span>
                <span className={`${getTrendColor(item.trend)} font-medium`}>
                  {item.percentageChange > 0 ? '+' : ''}{item.percentageChange}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrafficTrends; 