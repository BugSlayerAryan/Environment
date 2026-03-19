import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Droplets, Thermometer, Leaf, AlertCircle, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { SoilAPI } from '../api';

/**
 * StatusBadge - Reusable status indicator component
 */
const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    optimal: {
      bg: 'bg-emerald-100 dark:bg-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-200',
      label: 'Optimal',
    },
    good: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-700 dark:text-green-200',
      label: 'Good',
    },
    moderate: {
      bg: 'bg-amber-100 dark:bg-amber-900',
      text: 'text-amber-700 dark:text-amber-200',
      label: 'Moderate',
    },
    dry: {
      bg: 'bg-orange-100 dark:bg-orange-900',
      text: 'text-orange-700 dark:text-orange-200',
      label: 'Dry',
    },
    wet: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-700 dark:text-blue-200',
      label: 'Wet',
    },
    acidic: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-700 dark:text-red-200',
      label: 'Acidic',
    },
    neutral: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-700 dark:text-green-200',
      label: 'Neutral',
    },
    alkaline: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-700 dark:text-blue-200',
      label: 'Alkaline',
    },
    poor: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-700 dark:text-red-200',
      label: 'Poor',
    },
    medium: {
      bg: 'bg-amber-100 dark:bg-amber-900',
      text: 'text-amber-700 dark:text-amber-200',
      label: 'Medium',
    },
    high: {
      bg: 'bg-emerald-100 dark:bg-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-200',
      label: 'High',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.moderate;

  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  );
};

/**
 * ProgressBar - Animated progress indicator
 */
const ProgressBar = ({ value, max = 100, showLabel = true, className = '', color = 'blue' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min((animatedValue / max) * 100, 100);

  const colorMap = {
    blue: 'from-cyan-400 to-blue-500 dark:from-cyan-500 dark:to-blue-600',
    green: 'from-emerald-400 to-green-500 dark:from-emerald-500 dark:to-green-600',
    orange: 'from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600',
    red: 'from-red-400 to-rose-500 dark:from-red-500 dark:to-rose-600',
  };

  return (
    <div className={className}>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${colorMap[color] || colorMap.blue} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={animatedValue}
          aria-valuemin="0"
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
};

/**
 * MetricCard - Reusable metric display component
 */
// eslint-disable-next-line no-unused-vars
const MetricCard = ({ icon: Icon, label, value, unit, status, statusBadge, trend, trendDirection, color, showProgress, progressValue, progressMax, isDarkMode = false }) => {
  const iconBgMap = {
    blue: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-500/15',
    green: isDarkMode ? 'bg-green-900/30' : 'bg-green-500/15',
    orange: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-500/15',
    red: isDarkMode ? 'bg-red-900/30' : 'bg-red-500/15',
  };

  const iconColorMap = {
    blue: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    green: isDarkMode ? 'text-green-400' : 'text-green-600',
    orange: isDarkMode ? 'text-orange-400' : 'text-orange-600',
    red: isDarkMode ? 'text-red-400' : 'text-red-600',
  };

  const borderColorMap = {
    blue: isDarkMode ? 'border-blue-700/20' : 'border-blue-200/40',
    green: isDarkMode ? 'border-green-700/20' : 'border-green-200/40',
    orange: isDarkMode ? 'border-orange-700/20' : 'border-orange-200/40',
    red: isDarkMode ? 'border-red-700/20' : 'border-red-200/40',
  };

  return (
    <div className={`rounded-lg p-2 transition-all duration-200 border ${
      isDarkMode ? 'bg-slate-800/30' : 'bg-white/50'
    } shadow-sm ${borderColorMap[color]}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className={`w-5 h-5 ${iconBgMap[color]} rounded flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-2.5 h-2.5 ${iconColorMap[color]}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-xs font-semibold ${
            trendDirection === 'up'
              ? isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100/60 text-green-700'
              : isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100/60 text-red-700'
          }`}>
            {trendDirection === 'up' ? (
              <TrendingUp className="w-2 h-2" />
            ) : (
              <TrendingDown className="w-2 h-2" />
            )}
            <span className="text-xs">{trend}%</span>
          </div>
        )}
      </div>

      {/* Label */}
      <span className={`text-xs font-medium block mb-1 truncate ${
        isDarkMode ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {label}
      </span>

      {/* Value */}
      <div className="flex items-baseline gap-0.5 mb-1.5">
        <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </span>
        {unit && (
          <span className={`text-xs font-normal ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {unit}
          </span>
        )}
      </div>

      {/* Status Badge */}
      {statusBadge && (
        <div>
          <StatusBadge status={statusBadge} />
        </div>
      )}
    </div>
  );
};

/**
 * SoilMonitoringCard - Premium Soil Monitoring Dashboard Component
 * 
 * @param {Object} props
 * @param {Object} props.location - Location coordinates {lat, lon}
 * @param {number} props.moisture - Soil moisture percentage (0-100)
 * @param {number} props.temperature - Soil temperature in Celsius
 * @param {number} props.ph - Soil pH level (0-14)
 * @param {string} props.nutrientLevel - Nutrient level ('Poor', 'Medium', 'High')
 * @param {boolean} props.isLoading - Loading state
 * @param {function} props.onMenuClick - Menu action handler
 * @param {Object} props.trends - Trend data {moisture, temperature, ph, nutrient}
 */
const SoilMonitoringCard = ({
  location = { lat: 28.6139, lon: 77.2090 }, // Default: New Delhi
  moisture = 45,
  temperature = 28,
  ph = 6.8,
  nutrientLevel = 'Medium',
  isLoading: externalLoading = false,
  onMenuClick = () => {},
  trends = { moisture: 2, temperature: 1, ph: 0, nutrient: 3 },
  trendDirections = { moisture: 'up', temperature: 'up', ph: 'stable', nutrient: 'up' },
  isDarkMode = false,
}) => {
  // State for API data
  const [soilData, setSoilData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  // ========================================
  // HELPER: Parse ISRIC API Response
  // ========================================
  const parseSoilData = useCallback((apiData) => {
    try {
      let phValue = ph; // fallback
      let socValue = nutrientLevel; // fallback (High/Medium/Low)
      let bdodValue = '1.3'; // fallback for bulk density

      // Parse pH (phh2o property)
      if (apiData?.phh2o?.[0]?.values) {
        const phValues = apiData.phh2o[0].values;
        if (phValues.mean !== undefined) {
          phValue = (phValues.mean / 10).toFixed(1); // API returns pH * 10
        }
      }

      // Parse Soil Organic Carbon (soc)
      if (apiData?.soc?.[0]?.values) {
        const socValues = apiData.soc[0].values;
        if (socValues.mean !== undefined) {
          const socMean = socValues.mean / 10; // Typically in g/kg, convert to %
          if (socMean < 10) socValue = 'Low';
          else if (socMean < 20) socValue = 'Medium';
          else socValue = 'High';
        }
      }

      // Parse Bulk Density (bdod)
      if (apiData?.bdod?.[0]?.values) {
        const bdodValues = apiData.bdod[0].values;
        if (bdodValues.mean !== undefined) {
          bdodValue = (bdodValues.mean / 100).toFixed(2); // API returns in cg/cm³
        }
      }

      return {
        ph: parseFloat(phValue),
        soc: socValue,
        bdod: bdodValue,
      };
    } catch (err) {
      console.error('Error parsing soil data:', err);
      return { ph, soc: nutrientLevel, bdod: '1.3' };
    }
  }, [ph, nutrientLevel]);

  // ========================================
  // EFFECT: Fetch Soil Data When Location Changes
  // ========================================
  useEffect(() => {
    const fetchSoilData = async () => {
      if (!location?.lat || !location?.lon) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await SoilAPI.get(location.lat, location.lon);
        const parsed = parseSoilData(data);
        setSoilData(parsed);
      } catch (err) {
        console.error('Soil API Error:', err);
        setError(err.message);
        // Keep using existing values as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoilData();
  }, [location?.lat, location?.lon, parseSoilData]);

  // ========================================
  // USE REAL DATA OR FALLBACK
  // ========================================
  const displayPh = soilData?.ph ?? ph;
  const displaySoc = soilData?.soc ?? nutrientLevel;
  const actualLoading = isLoading || externalLoading;



  // Compute moisture status
  const getMoistureStatus = useMemo(() => {
    return () => {
      if (moisture < 25) return { status: 'Dry', badge: 'dry', color: 'orange' };
      if (moisture < 40) return { status: 'Dry', badge: 'dry', color: 'orange' };
      if (moisture <= 65) return { status: 'Optimal', badge: 'optimal', color: 'green' };
      return { status: 'Wet', badge: 'wet', color: 'blue' };
    };
  }, [moisture])();

  // Compute pH status (use real data)
  const getPhStatus = useMemo(() => {
    return () => {
      if (displayPh < 6) return { status: 'Acidic', badge: 'acidic', color: 'red' };
      if (displayPh < 7.3) return { status: 'Neutral', badge: 'neutral', color: 'green' };
      return { status: 'Alkaline', badge: 'alkaline', color: 'blue' };
    };
  }, [displayPh])();

  // Compute nutrient status (use real data)
  const getNutrientColor = useMemo(() => {
    return () => {
      if (displaySoc === 'Poor') return 'red';
      if (displaySoc === 'Medium') return 'orange';
      return 'green';
    };
  }, [displaySoc])();

  // Compute temperature status
  const getTempStatus = useMemo(() => {
    return () => {
      if (temperature < 10) return { status: 'Cold', badge: 'moderate', color: 'blue' };
      if (temperature <= 35) return { status: 'Optimal', badge: 'optimal', color: 'green' };
      return { status: 'Hot', badge: 'moderate', color: 'orange' };
    };
  }, [temperature])();

  const moistureData = getMoistureStatus;
  const phData = getPhStatus;
  const tempData = getTempStatus;
  const nutrientColor = getNutrientColor;

  if (actualLoading) {
    return (
      <div className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 ${
        isDarkMode
          ? 'bg-slate-800 border border-slate-700/60'
          : 'bg-white border border-emerald-200/60'
      }`}>
        <div className="space-y-4">
          <div className={`h-6 rounded w-1/3 animate-pulse ${isDarkMode ? 'bg-slate-700' : 'bg-emerald-100'}`} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-32 rounded animate-pulse ${isDarkMode ? 'bg-slate-700' : 'bg-emerald-50'}`} />
            ))}
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
          : 'bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/60 hover:border-emerald-300/80 backdrop-blur-sm'
      }`}
      style={{ animation: 'slideUp 0.5s ease-out' }}
      role="region"
      aria-label="Soil monitoring information"
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
        <div className="flex items-center gap-2">
          <Leaf className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Soil Monitoring
          </h2>
        </div>
        <button
          onClick={onMenuClick}
          className={`p-1.5 rounded-lg transition-all duration-150 ${
            isDarkMode
              ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/60'
              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-100/50'
          }`}
          aria-label="Soil monitoring card options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Main Metrics Grid */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 sm:px-6 py-2 sm:py-2.5 space-y-1">
        <div className="grid grid-cols-2 gap-1.5 mb-1">
          {/* Soil Moisture */}
          <MetricCard
            icon={Droplets}
            label="Soil Moisture"
            value={moisture}
            unit="%"
            statusBadge={moistureData.badge}
            trend={Math.abs(trends.moisture)}
            trendDirection={trendDirections.moisture}
            color={moistureData.color}
            isDarkMode={isDarkMode}
          />

          {/* Temperature */}
          <MetricCard
            icon={Thermometer}
            label="Soil Temperature"
            value={temperature}
            unit="°C"
            statusBadge={tempData.badge}
            trend={Math.abs(trends.temperature)}
            trendDirection={trendDirections.temperature}
            color={tempData.color}
            isDarkMode={isDarkMode}
          />

          {/* Soil pH */}
          <MetricCard
            icon={AlertCircle}
            label="Soil pH"
            value={displayPh.toFixed(1)}
            statusBadge={phData.badge}
            trend={Math.abs(trends.ph)}
            trendDirection={trendDirections.ph}
            color={phData.color}
            isDarkMode={isDarkMode}
          />

          {/* Nutrient Level */}
          <MetricCard
            icon={Leaf}
            label="Nutrient Level"
            value={displaySoc}
            statusBadge={displaySoc}
            trend={Math.abs(trends.nutrient)}
            trendDirection={trendDirections.nutrient}
            color={nutrientColor}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Summary Section */}
        <div className={`border-t ${
          isDarkMode ? 'border-slate-700/30' : 'border-emerald-200/30'
        } pt-1`}>
          <h4 className={`text-xs font-semibold ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          } mb-1 flex items-center gap-1`}>
            <AlertCircle className="w-2.5 h-2.5" />
            Health Summary
          </h4>

          <div className="grid grid-cols-3 gap-1.5">
            {/* Moisture Assessment */}
            <div className={`rounded-lg p-1 border ${
              isDarkMode 
                ? 'bg-blue-900/20 border-blue-700/40' 
                : 'bg-blue-100 border-blue-400/70'
            }`}>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block mb-0.5">💧</span>
              <span className={`text-xs font-bold line-clamp-1 uppercase tracking-tight ${
                isDarkMode ? 'text-white' : 'text-blue-950'
              }`}>
                {moisture < 30 ? 'Critical' : moisture < 45 ? 'Low' : 'Balanced'}
              </span>
            </div>

            {/* Temperature Assessment */}
            <div className={`rounded-lg p-1 border ${
              isDarkMode 
                ? 'bg-orange-900/20 border-orange-700/40' 
                : 'bg-orange-100 border-orange-400/70'
            }`}>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium block mb-0.5">🌡️</span>
              <span className={`text-xs font-bold line-clamp-1 uppercase tracking-tight ${
                isDarkMode ? 'text-white' : 'text-orange-950'
              }`}>
                {temperature < 10 ? 'Cold' : temperature > 35 ? 'Hot' : 'Ideal'}
              </span>
            </div>

            {/* pH Assessment */}
            <div className={`rounded-lg p-1 border ${
              isDarkMode 
                ? 'bg-green-900/20 border-green-700/40' 
                : 'bg-green-100 border-green-400/70'
            }`}>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium block mb-0.5">🌱</span>
              <span className={`text-xs font-bold line-clamp-1 uppercase tracking-tight ${
                isDarkMode ? 'text-white' : 'text-green-950'
              }`}>
                {phData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Overall Status */}
      <div className={`flex-shrink-0 text-xs text-center px-4 sm:px-6 pb-3 sm:pb-4 pt-0 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-500'
      }`}>
        🌾 Real-time soil monitoring
      </div>
    </div>
  );
};

export default SoilMonitoringCard;
