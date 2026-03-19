import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Cloud,
  MapPin,
  Bell,
  Leaf,
  Gauge,
  Zap,
} from 'lucide-react';
import Header from '../DashboardComponents/Header ';
import WeatherCard from '../DashboardComponents/WeatherCard';
import AqiCard from '../DashboardComponents/AqiCard';
import UVcard from '../DashboardComponents/UvCard';
import WaterQualityCard from '../DashboardComponents/WaterQualityCard';
import SoilMonitoring from '../DashboardComponents/SoilMonitoring';
import EcosystemMonitoring from '../DashboardComponents/EcosystemMonitoring';
import PollenVegetationCard from '../DashboardComponents/PollenVegetationCard';

// ═══════════════════════════════════════════════════════════════
// PREMIUM DASHBOARD
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// ENVIRONMENTAL SUMMARY BANNER - PREMIUM DESIGN
// ═══════════════════════════════════════════════════════════════

const EnvironmentSummaryBanner = ({ score = 72, status = 'Moderate', isDarkMode = false }) => {
  const getScoreColor = () => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'amber';
    return 'red';
  };

  const colorClass = getScoreColor();
  const statusColorMap = {
    emerald: {
      light: 'from-emerald-400/30 via-green-400/20 to-cyan-400/10',
      dark: 'from-emerald-900/40 via-green-900/30 to-cyan-900/20',
      border: {
        light: 'border-emerald-300/50',
        dark: 'border-emerald-700/40',
      },
      badge: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/60 dark:to-green-900/60 dark:text-emerald-200',
      icon: 'text-emerald-600 dark:text-emerald-400',
      scoreCircle: 'from-emerald-500/40 dark:from-emerald-600/30',
      progressStroke: '#059669',
    },
    amber: {
      light: 'from-amber-400/30 via-yellow-400/20 to-orange-400/10',
      dark: 'from-amber-900/40 via-yellow-900/30 to-orange-900/20',
      border: {
        light: 'border-amber-300/50',
        dark: 'border-amber-700/40',
      },
      badge: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/60 dark:to-yellow-900/60 dark:text-amber-200',
      icon: 'text-amber-600 dark:text-amber-400',
      scoreCircle: 'from-amber-500/40 dark:from-amber-600/30',
      progressStroke: '#d97706',
    },
    red: {
      light: 'from-red-400/30 via-orange-400/20 to-pink-400/10',
      dark: 'from-red-900/40 via-orange-900/30 to-pink-900/20',
      border: {
        light: 'border-red-300/50',
        dark: 'border-red-700/40',
      },
      badge: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 dark:from-red-900/60 dark:to-orange-900/60 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
      scoreCircle: 'from-red-500/40 dark:from-red-600/30',
      progressStroke: '#dc2626',
    },
  };

  const recommendations = {
    emerald: '✅ Excellent environmental conditions. Perfect for outdoor activities!',
    amber: '⚠️ Moderate conditions. Recommended to limit intense outdoor exposure.',
    red: '🚨 Poor environmental quality. Avoid prolonged outdoor activities.',
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 lg:pt-8 pb-2 sm:pb-2 lg:pb-3"
    >
      <style>{`
        @keyframes float-animation {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 8px currentColor); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 20px currentColor); }
        }
        .float-animate { animation: float-animation 4s ease-in-out infinite; }
        .glow-pulse-animate { animation: glow-pulse 3s ease-in-out infinite; }
      `}</style>

      <div className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-2xl hover:shadow-2xl ${
        isDarkMode
          ? `bg-gradient-to-br ${statusColorMap[colorClass].dark} ${statusColorMap[colorClass].border.dark}`
          : `bg-gradient-to-br ${statusColorMap[colorClass].light} ${statusColorMap[colorClass].border.light}`
      } backdrop-blur-xl`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl ${
            isDarkMode ? 'bg-emerald-500' : 'bg-emerald-300'
          } rounded-full float-animate`} />
          <div className={`absolute bottom-0 left-0 w-80 h-80 opacity-15 blur-3xl ${
            isDarkMode ? 'bg-cyan-500' : 'bg-cyan-300'
          } rounded-full float-animate`} style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-5 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
            {/* Progressive Score Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 flex justify-center lg:justify-start"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 glow-pulse-animate" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isDarkMode ? 'text-slate-700' : 'text-slate-200'}
                  />
                  <defs>
                    <linearGradient id={`scoreGrad-${colorClass}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={statusColorMap[colorClass].progressStroke} stopOpacity="1" />
                      <stop offset="100%" stopColor={statusColorMap[colorClass].progressStroke} stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={`url(#scoreGrad-${colorClass})`}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <div className={`text-4xl sm:text-5xl font-black tracking-tighter ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {score}
                    </div>
                    <div className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Score
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-4 space-y-4"
            >
              {/* Title */}
              <div>
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-2 tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Environmental Quality
                </h2>
                <p className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Real-time monitoring across all environmental parameters
                </p>
              </div>

              {/* Status & Recommendation */}
              <div className="pt-3 space-y-3">
                {/* Status Badge */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <span className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base ${
                    statusColorMap[colorClass].badge
                  } shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border ${
                    isDarkMode ? 'border-white/10' : 'border-white/30'
                  }`}>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-base"
                    >
                      {colorClass === 'emerald' ? '✅' : colorClass === 'amber' ? '⚠️' : '🚨'}
                    </motion.span>
                    <span>{status}</span>
                  </span>
                </motion.div>

                {/* Recommendation */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-sm sm:text-base font-semibold ${
                    statusColorMap[colorClass].icon
                  }`}
                >
                  {recommendations[colorClass]}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Theme mode - default to dark
  const [weatherLocation, setWeatherLocation] = useState({ lat: 28.6139, lon: 77.2090 }); // Default: New Delhi

  // Debug: Log location changes
  useEffect(() => {
    console.log('📍 Dashboard weatherLocation updated:', weatherLocation);
  }, [weatherLocation]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50'
    }`}>
      {/* Header with Search Bar */}
      <Header 
        isDarkMode={isDarkMode}
        onLocationSelect={(coords) => setWeatherLocation(coords)}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content */}
      <main className="pb-16 relative z-10">
        {/* Environmental Summary Banner */}
        <EnvironmentSummaryBanner
          score={72}
          status="Moderate"
          isDarkMode={isDarkMode}
        />

        {/* Dashboard Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-max"
          >
            {/* 1. Weather Monitoring */}
            <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-2">
              <WeatherCard 
                isDarkMode={isDarkMode}
                latitude={weatherLocation.lat}
                longitude={weatherLocation.lon}
              />
            </motion.div>

            {/* 2. Air Quality Index */}
            <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-2">
              <AqiCard isDarkMode={isDarkMode} location={weatherLocation} />
            </motion.div>

            {/* 3. UV & Radiation */}
            <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-2">
              <UVcard isDarkMode={isDarkMode} location={weatherLocation} />
            </motion.div>

            {/* 4. Water Quality */}
            <motion.div variants={cardVariants} className="lg:col-span-1">
              <WaterQualityCard isDarkMode={isDarkMode} location={weatherLocation} />
            </motion.div>

            {/* 5. Pollen & Vegetation */}
            <motion.div variants={cardVariants} className="lg:col-span-1">
              <PollenVegetationCard isDarkMode={isDarkMode} location={weatherLocation} />
            </motion.div>

            {/* 6. Soil Monitoring */}
            <motion.div variants={cardVariants} className="lg:col-span-1">
              <SoilMonitoring isDarkMode={isDarkMode} location={weatherLocation} />
            </motion.div>
          </motion.div>

          {/* Ecosystem Monitoring - Full Width */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 lg:mt-12"
          >
            <motion.div variants={cardVariants}>
              <EcosystemMonitoring isDarkMode={isDarkMode} />
            </motion.div>
          </motion.div>

          {/* Status Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8"
          >
            {/* System Status */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className={`group rounded-2xl backdrop-blur-xl p-6 lg:p-8 border-2 transition-all duration-300 hover:shadow-2xl overflow-hidden relative ${
                isDarkMode
                  ? 'bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-700/40 hover:border-emerald-600/70 hover:from-emerald-900/40 hover:to-green-900/40'
                  : 'bg-gradient-to-br from-emerald-50/80 to-green-50/50 border-emerald-300/60 hover:border-emerald-400/80 hover:from-emerald-50/100 hover:to-green-50/70'
              }`}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                isDarkMode ? 'bg-emerald-500' : 'bg-emerald-300'
              } blur-3xl`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isDarkMode
                        ? 'bg-emerald-900/50 group-hover:bg-emerald-800'
                        : 'bg-emerald-100/80 group-hover:bg-emerald-200'
                    }`}
                  >
                    <Leaf className={`w-6 h-6 ${
                      isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                    }`} />
                  </motion.div>
                  <h3 className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    System Status
                  </h3>
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  All monitoring systems operating optimally with 99.8% uptime. Real-time data collection active.
                </p>
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/50"
                  />
                  <span className={`text-xs font-bold tracking-wide ${
                    isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                  }`}>
                    All Systems Operational
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Alerts Summary */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className={`group rounded-2xl backdrop-blur-xl p-6 lg:p-8 border-2 transition-all duration-300 hover:shadow-2xl overflow-hidden relative ${
                isDarkMode
                  ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-700/40 hover:border-cyan-600/70 hover:from-cyan-900/40 hover:to-blue-900/40'
                  : 'bg-gradient-to-br from-cyan-50/80 to-blue-50/50 border-cyan-300/60 hover:border-cyan-400/80 hover:from-cyan-50/100 hover:to-blue-50/70'
              }`}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                isDarkMode ? 'bg-cyan-500' : 'bg-cyan-300'
              } blur-3xl`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isDarkMode
                        ? 'bg-cyan-900/50 group-hover:bg-cyan-800'
                        : 'bg-cyan-100/80 group-hover:bg-cyan-200'
                    }`}
                  >
                    <Bell className={`w-6 h-6 ${
                      isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                    }`} />
                  </motion.div>
                  <h3 className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Active Alerts
                  </h3>
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  2 weather alerts active. Continuing to monitor environmental conditions closely.
                </p>
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"
                  />
                  <span className={`text-xs font-bold tracking-wide ${
                    isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                  }`}>
                    2 Active Warnings
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className={`group rounded-2xl backdrop-blur-xl p-6 lg:p-8 border-2 transition-all duration-300 hover:shadow-2xl overflow-hidden relative ${
                isDarkMode
                  ? 'bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-700/40 hover:border-purple-600/70 hover:from-purple-900/40 hover:to-violet-900/40'
                  : 'bg-gradient-to-br from-purple-50/80 to-violet-50/50 border-purple-300/60 hover:border-purple-400/80 hover:from-purple-50/100 hover:to-violet-50/70'
              }`}
            >
              {/* Animated background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                isDarkMode ? 'bg-purple-500' : 'bg-purple-300'
              } blur-3xl`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isDarkMode
                        ? 'bg-purple-900/50 group-hover:bg-purple-800'
                        : 'bg-purple-100/80 group-hover:bg-purple-200'
                    }`}
                  >
                    <Gauge className={`w-6 h-6 ${
                      isDarkMode ? 'text-purple-300' : 'text-purple-600'
                    }`} />
                  </motion.div>
                  <h3 className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Performance
                  </h3>
                </div>
                <p className={`text-sm mb-4 leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Data refresh: 2 minutes ago. API response time: 245ms average.
                </p>
                <motion.div
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50"
                  />
                  <span className={`text-xs font-bold tracking-wide ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    Excellent Performance
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;