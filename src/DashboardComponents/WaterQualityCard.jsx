import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Droplets, AlertCircle, Waves, MoreHorizontal, RefreshCw } from 'lucide-react';
import { WaterAPI } from '../api';

/**
 * pH Status Classification
 * Acidic: < 6.5 | Neutral: 6.5-8.5 | Alkaline: > 8.5
 */
const getPHStatus = (value) => {
  if (value < 6.5) return { label: 'Acidic', color: 'from-red-500 to-orange-500', textColor: 'text-red-700', bgColor: 'bg-red-50' };
  if (value > 8.5) return { label: 'Alkaline', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' };
  return { label: 'Neutral', color: 'from-green-500 to-emerald-600', textColor: 'text-green-700', bgColor: 'bg-green-50' };
};

/**
 * Dissolved Oxygen Status Classification
 * Poor: < 5 mg/L | Moderate: 5-7 mg/L | Good: >= 7 mg/L
 */
const getDOStatus = (value) => {
  if (value < 5) return { label: 'Poor', severity: 'critical', color: 'text-red-600', bgColor: 'bg-red-100' };
  if (value < 7) return { label: 'Moderate', severity: 'moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
  return { label: 'Good', severity: 'good', color: 'text-green-600', bgColor: 'bg-green-100' };
};

/**
 * Pollution Level Classification
 */
const getPollutionStatus = (level) => {
  const levels = {
    low: { label: 'Low', color: 'from-green-500 to-emerald-600', textColor: 'text-green-700', bgColor: 'bg-green-100' },
    moderate: { label: 'Moderate', color: 'from-yellow-500 to-amber-600', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    high: { label: 'High', color: 'from-red-500 to-orange-600', textColor: 'text-red-700', bgColor: 'bg-red-100' },
  };
  return levels[level] || levels.low;
};

/**
 * MetricItem - Reusable metric display component
 */
// eslint-disable-next-line no-unused-vars
const MetricItem = ({ icon: Icon, label, value, unit, status, isDarkMode, progressValue, progressMax }) => (
  <div className={`flex items-start gap-3 p-2 sm:p-2.5 rounded-lg transition-all duration-300 ${
    isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-blue-50/50'
  }`}>
    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
      isDarkMode ? 'text-blue-400' : 'text-blue-600'
    }`} aria-hidden="true" />
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          {label}
        </span>
        {status && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${status.bgColor} ${status.color}`}>
            {status.label}
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </span>
        {unit && (
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            {unit}
          </span>
        )}
      </div>
      
      {progressValue !== undefined && progressMax && (
        <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${(progressValue / progressMax) * 100}%` }}
            role="progressbar"
            aria-valuenow={progressValue}
            aria-valuemin="0"
            aria-valuemax={progressMax}
          />
        </div>
      )}
    </div>
  </div>
);

/**
 * WaterQualityCard - Premium Water Quality Component
 */
const WaterQualityCard = ({
  isDarkMode = false,
  location = { lat: 28.6139, lon: 77.2090 }, // Default: New Delhi
  showMenu = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [waterData, setWaterData] = useState({
    ph: 7.2,
    dissolvedOxygen: 6.8,
    pollutionLevel: 'low',
    temperature: 22,
    turbidity: 'Clear',
    siteName: 'Unknown Site',
    timestamp: new Date().toISOString(),
  });
  const menuRef = useRef(null);

  // Derived states from waterData
  const phStatus = useMemo(() => getPHStatus(waterData.ph), [waterData.ph]);
  const doStatus = useMemo(() => getDOStatus(waterData.dissolvedOxygen), [waterData.dissolvedOxygen]);
  const pollutionStatus = useMemo(() => getPollutionStatus(waterData.pollutionLevel), [waterData.pollutionLevel]);

  // Helper function to classify pollution level based on water quality metrics
  // Combines pH and DO data to derive overall water quality
  const classifyPollutionLevel = (do_value, ph_value) => {
    const issues = [];
    
    // Check dissolved oxygen (critical water quality indicator)
    // DO < 5 is critical (poor), 5-7 is moderate, >= 7 is good
    if (do_value < 5) issues.push('critical');
    else if (do_value < 7) issues.push('moderate');
    
    // Check pH (acidic/alkaline conditions indicate pollution)
    // Neutral pH (6.5-8.5) is good, extreme values indicate poor quality
    if (ph_value < 6.5 || ph_value > 8.5) {
      // More extreme deviation = more severe
      const deviationFromOptimal = Math.min(
        Math.abs(ph_value - 6.5),
        Math.abs(ph_value - 8.5)
      );
      if (deviationFromOptimal > 1.5) issues.push('critical');
      else issues.push('moderate');
    }
    
    // Determine overall pollution level based on issues found
    if (issues.includes('critical')) return 'high';
    if (issues.includes('moderate')) return 'moderate';
    return 'low';
  };

  // Fetch water quality data from USGS API
  const fetchWaterQuality = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      console.log('🌊 Fetching water quality for:', { lat: location.lat, lon: location.lon });
      
      const response = await WaterAPI.get(location.lat, location.lon);
      
      console.log('💧 Water Quality Response:', response);
      console.log('📊 Data Source:', response.source);
      
      // USGSAPI always returns data (either live or fallback)
      // It will never return null/undefined due to triple-level fallback
      if (!response) {
        throw new Error('No data received');
      }
      
      // Classify pollution level based on DO and pH
      const pollutionLevel = classifyPollutionLevel(response.dissolvedOxygen, response.ph);
      
      // Map turbidity numeric value to clarity descriptors
      // Low turbidity (< 1 NTU) = Crystal Clear
      // Medium (1-3 NTU) = Clear
      // Medium-High (3-5 NTU) = Slightly Cloudy
      // High (> 5 NTU) = Turbid/Polluted
      let turbidityDescriptor = 'Clear'; // Default fallback
      if (response.turbidity !== null && response.turbidity !== undefined) {
        const turbidityValue = parseFloat(response.turbidity);
        if (turbidityValue < 1) {
          turbidityDescriptor = 'Crystal Clear';
        } else if (turbidityValue < 3) {
          turbidityDescriptor = 'Clear';
        } else if (turbidityValue < 5) {
          turbidityDescriptor = 'Slightly Cloudy';
        } else {
          turbidityDescriptor = 'Turbid';
        }
      }
      
      setWaterData({
        ph: response.ph || 7.2,
        dissolvedOxygen: response.dissolvedOxygen || 6.8,
        pollutionLevel,
        temperature: response.temperature || 22,
        turbidity: turbidityDescriptor,
        siteName: response.siteName || 'USGS Monitoring Station',
        timestamp: response.timestamp || new Date().toISOString(),
      });
      
      // Success - even if using fallback data
      setIsLoading(false);
      setHasError(false);
    } catch (error) {
      // This should rarely execute given the triple-level fallback in USGSAPI
      console.error('❌ Water Quality Fetch Error:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [location.lat, location.lon]);

  // Fetch water quality data when location changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWaterQuality();
    }, 300); // Debounce rapid location changes
    
    return () => clearTimeout(timer);
  }, [location, fetchWaterQuality]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchWaterQuality();
    } catch (error) {
      console.error('Water quality refresh failed:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [fetchWaterQuality]);

  // Close menu on outside click with ref-based detection
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
      }`} role="status" aria-label="Loading water quality information" aria-busy="true">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
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
            <h3 className="font-semibold mb-1">Unable to load water quality data</h3>
            <p className="text-sm opacity-90">Please try refreshing the data.</p>
            <button
              onClick={handleRefresh}
              className={`mt-3 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-red-800/50 hover:bg-red-800'
                  : 'bg-red-100 hover:bg-red-200'
              }`}
              aria-label="Retry loading water quality data"
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
      className={`rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col min-h-[430px] ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 hover:border-slate-600/80 backdrop-blur-sm'
          : 'bg-gradient-to-br from-white to-blue-50/50 border border-cyan-200/60 hover:border-cyan-300/80 backdrop-blur-sm'
      }`}
      style={{ animation: 'slideUp 0.5s ease-out' }}
      role="region"
      aria-label="Water quality information"
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

      {/* Header Section */}
      <div className={`flex items-center justify-between flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-0 border-b ${
        isDarkMode ? 'border-slate-700/30' : 'border-cyan-200/30'
      }`}>
        <h3 className={`font-bold text-base sm:text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Water Quality
        </h3>

        {showMenu && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMenuOpen(false);
                if (e.key === 'Enter') setIsMenuOpen(!isMenuOpen);
              }}
              className={`p-1.5 rounded-lg transition-all duration-300 group ${
                isDarkMode
                  ? 'hover:bg-slate-700/60 text-gray-400 hover:text-gray-200'
                  : 'hover:bg-cyan-100/50 text-gray-500 hover:text-gray-700'
              }`}
              aria-label="Water quality menu options"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
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
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2 font-medium ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-slate-600/50 border-b border-slate-600/30'
                      : 'text-gray-700 hover:bg-cyan-50/70 border-b border-gray-100/50'
                  }`}
                  role="menuitem"
                  aria-label="Refresh water quality data"
                >
                  <RefreshCw className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'
                  }`} aria-hidden="true" />
                  <span>Refresh Data</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 py-2 sm:py-3">
        {/* pH Level Metric */}
        <MetricItem
          icon={Droplets}
          label="pH Level"
          value={waterData.ph.toFixed(1)}
          unit="(0-14)"
          status={phStatus}
          isDarkMode={isDarkMode}
          progressValue={waterData.ph}
          progressMax={14}
        />

        {/* Dissolved Oxygen Metric */}
        <MetricItem
          icon={Waves}
          label="Dissolved Oxygen"
          value={waterData.dissolvedOxygen.toFixed(1)}
          unit="mg/L"
          status={doStatus}
          isDarkMode={isDarkMode}
          progressValue={waterData.dissolvedOxygen}
          progressMax={12}
        />

        {/* Pollution Level Metric */}
        <div className={`flex items-start gap-3 p-2 sm:p-2.5 rounded-lg transition-all duration-300 ${
          isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-blue-50/50'
        }`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} aria-hidden="true" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Pollution Level
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pollutionStatus.bgColor} ${pollutionStatus.textColor}`}>
                {pollutionStatus.label}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                Status:
              </span>
              <span className={`text-xs font-semibold ${
                isDarkMode ? 'text-gray-200' : 'text-slate-900'
              }`}>
                {waterData.pollutionLevel === 'low' ? 'Safe for aquatic life' : 
                 waterData.pollutionLevel === 'moderate' ? 'Caution advised' : 
                 'High contamination'}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          {/* Temperature */}
          <div className={`p-2 sm:p-2.5 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-blue-50/50'}`}>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Temp
            </p>
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {waterData.temperature}°C
            </p>
          </div>

          {/* Turbidity */}
          <div className={`p-2 sm:p-2.5 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-blue-50/50'}`}>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Clarity
            </p>
            <p className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {waterData.turbidity}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className={`flex-shrink-0 text-xs text-center px-4 sm:px-6 pb-3 sm:pb-4 pt-0 transition-opacity hover:opacity-100 ${
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>
        💧 Real-time water monitoring
      </div>
    </div>
  );
};

WaterQualityCard.defaultProps = {
  isDarkMode: false,
  location: { lat: 28.6139, lon: 77.2090 },
  showMenu: true,
};

export default WaterQualityCard;