import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Leaf, Wind, AlertCircle, MoreHorizontal, TrendingUp, RefreshCw } from 'lucide-react';
import { PollenAPI } from '../api';

/**
 * StatusBadge - Reusable status indicator component
 */
const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    low: {
      bg: 'bg-emerald-100 dark:bg-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-200',
      label: 'Low',
    },
    moderate: {
      bg: 'bg-amber-100 dark:bg-amber-900',
      text: 'text-amber-700 dark:text-amber-200',
      label: 'Moderate',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900',
      text: 'text-orange-700 dark:text-orange-200',
      label: 'High',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.low;

  return (
    <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-lg ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
};

/**
 * ProgressBar - Animated progress indicator
 */
const ProgressBar = ({ value, max = 100, showLabel = true, className = '' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min((animatedValue / max) * 100, 100);

  return (
    <div className={className}>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 dark:from-emerald-500 dark:via-green-600 dark:to-teal-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={animatedValue}
          aria-valuemin="0"
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Vegetation Coverage</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
};

/**
 * PollenChart - Mini bar chart for pollen breakdown
 */
const PollenChart = ({ data, isLoading }) => {
  const [animatedBars] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-end justify-around h-24 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-t animate-pulse h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-around h-24 gap-2">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map((d) => d.value));
        const percentage = (item.value / maxValue) * 100;

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full h-full flex items-end justify-center">
              <div
                className={`w-full rounded-t-lg transition-all duration-700 ease-out ${item.color} shadow-md hover:shadow-lg hover:scale-105`}
                style={{
                  height: animatedBars ? `${percentage}%` : '0%',
                }}
                role="img"
                aria-label={`${item.name}: ${item.value} grains/m³`}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2">{item.name}</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};

const PollenVegetationCard = ({
  isDarkMode = false,
  location = { lat: 28.6139, lon: 77.2090 }, // Default: New Delhi
  showMenu = true,
}) => {
  const [animated] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const menuRef = useRef(null);

  // Pollen data state
  const [pollenLevel, setPollenLevel] = useState('High');
  const [pollenCount, setPollenCount] = useState(320);
  const [vegetationPercent, setVegetationPercent] = useState(65);
  const [pollenBreakdown, setPollenBreakdown] = useState([
    { name: 'Grass', value: 120, color: 'bg-green-400 dark:bg-green-500' },
    { name: 'Tree', value: 85, color: 'bg-teal-400 dark:bg-teal-500' },
    { name: 'Weed', value: 115, color: 'bg-lime-400 dark:bg-lime-500' },
  ]);
  const [healthHint, setHealthHint] = useState(null);

  // Fetch pollen data from API
  const fetchPollenData = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      console.log('🌿 Fetching pollen data for:', { lat: location.lat, lon: location.lon });
      
      const response = await PollenAPI.get(location.lat, location.lon);
      
      console.log('🌿 Pollen Response:', response);
      console.log('📊 Data Source:', response.source);
      
      if (!response) {
        throw new Error('No pollen data received');
      }
      
      // Update pollen count
      setPollenCount(response.pollenCount || 320);
      
      // Determine risk level and message
      const riskLevel = response.riskLevel || 'Low';
      setPollenLevel(riskLevel);
      
      // Set health hint based on risk level
      const hints = {
        Low: '✓ Good for outdoor activities',
        Moderate: '⚠ Mild allergy risk, consider precautions',
        High: '✕ High allergy risk, limit outdoor time',
      };
      setHealthHint(hints[riskLevel] || hints.Low);
      
      // Update pollen breakdown
      setPollenBreakdown([
        { name: 'Grass', value: response.grass || 120, color: 'bg-green-400 dark:bg-green-500' },
        { name: 'Tree', value: response.tree || 85, color: 'bg-teal-400 dark:bg-teal-500' },
        { name: 'Weed', value: response.weed || 115, color: 'bg-lime-400 dark:bg-lime-500' },
      ]);
      
      // Update vegetation coverage
      setVegetationPercent(response.vegetationIndex || 65);
      
      // Success - even if using fallback data
      setIsLoading(false);
      setHasError(false);
    } catch (error) {
      console.error('❌ Pollen Fetch Error:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [location.lat, location.lon]);

  // Fetch pollen data when location changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPollenData();
    }, 300); // Debounce rapid location changes
    
    return () => clearTimeout(timer);
  }, [location, fetchPollenData]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchPollenData();
    } catch (error) {
      console.error('Pollen data refresh failed:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [fetchPollenData]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);


  // Skeleton loading state
  if (isLoading) {
    return (
      <div className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 ${
        isDarkMode
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-gray-100'
      }`} role="status" aria-label="Loading pollen information" aria-busy="true">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
          </div>
          <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded-lg w-full"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div 
        className={`rounded-2xl p-4 sm:p-6 shadow-lg border ${
          isDarkMode
            ? 'bg-red-900/20 border-red-800 text-red-200'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="font-semibold mb-1">Unable to load pollen data</h3>
            <p className="text-sm opacity-90">Please try refreshing the data.</p>
            <button
              onClick={handleRefresh}
              className={`mt-3 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-red-800/50 hover:bg-red-800'
                  : 'bg-red-100 hover:bg-red-200'
              }`}
              aria-label="Retry loading pollen data"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col min-h-[430px] overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 hover:border-slate-600/80 backdrop-blur-sm'
          : 'bg-white border border-emerald-200/60 hover:border-emerald-300/80 backdrop-blur-sm'
      } ${animated ? 'opacity-100' : 'opacity-0'}`}
      style={{ animation: 'slideUp 0.5s ease-out' }}
      role="region"
      aria-label="Pollen and vegetation information"
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-enter { animation: slideIn 0.2s ease-out; }
      `}</style>
      {/* Header */}
      <div className={`flex items-center justify-between flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-0 border-b ${
        isDarkMode ? 'border-slate-700/30' : 'border-emerald-200/30'
      }`}>
        <div>
          <h3 className={`font-bold text-base sm:text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
            <Leaf className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            Pollen & Vegetation
          </h3>
        </div>

        {showMenu && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMenuOpen(false);
                if (e.key === 'Enter') setIsMenuOpen(!isMenuOpen);
              }}
              className={`p-1.5 rounded-lg transition-all duration-150 hover:shadow-md group cursor-pointer ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-700/60'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-100'
              }`}
              aria-label="Pollen and vegetation card options"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              type="button"
            >
              <MoreHorizontal className="w-5 h-5 transition-transform group-hover:scale-110" aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-200 menu-enter backdrop-blur-md ${
                isDarkMode
                  ? 'bg-slate-700/95 border border-slate-600/70'
                  : 'bg-white/95 border border-gray-200/70'
              }`} role="menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh();
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'text-gray-200 hover:bg-slate-600/50'
                      : 'text-slate-700 hover:bg-emerald-50'
                  } flex items-center gap-2`}
                  aria-label="Refresh pollen data"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 py-2 sm:py-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 mb-3">
          {/* Left Side - Pollen Count */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pollen Count</span>
                <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {pollenCount}
                  <span className={`text-xs font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ml-1`}>grains/m³</span>
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{healthHint || '✓ Good for outdoor activities'}</p>
            </div>

            {/* Status Badge */}
            <div className="pt-0.5">
              <StatusBadge status={pollenLevel} />
            </div>

            {/* Summary Stats */}
            <div className={`pt-1 space-y-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Impact Level</span>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                    pollenLevel === 'High'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      : pollenLevel === 'Moderate'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{pollenLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Pollen Chart */}
          <div className={`rounded-lg p-2 sm:p-2.5 border ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Wind className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                Breakdown
              </h4>
            </div>
            <PollenChart data={pollenBreakdown} isLoading={isLoading} />
          </div>
        </div>

        {/* Vegetation Section */}
        <div className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} pt-2 space-y-2 mt-1`}>
          <div className="flex items-center justify-between">
            <h4 className={`text-xs font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Leaf className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              Vegetation Density
            </h4>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Green Coverage</span>
          </div>

          <ProgressBar
            value={vegetationPercent}
            max={100}
            showLabel={true}
            className="mt-1"
          />

          {/* Vegetation Details */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className={`rounded-lg p-2 border ${
              isDarkMode
                ? 'bg-emerald-900/20 border-emerald-800/50'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className={`text-xs font-medium block mb-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Healthy</span>
              <span className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{vegetationPercent}%</span>
            </div>
            <div className={`rounded-lg p-2 border ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}>
              <span className={`text-xs font-medium block mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Trend</span>
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className={`flex-shrink-0 text-xs text-center px-4 sm:px-6 pb-3 sm:pb-4 pt-0 transition-opacity hover:opacity-100 ${
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>
        🌿 Real-time pollen monitoring
      </div>
    </div>
  );
};

export default PollenVegetationCard;