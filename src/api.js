// api.js
// 🌍 ENTERPRISE ENVIRONMENT DATA SERVICE

// ===============================
// 🌐 CONFIG
// ===============================
const CONFIG = {
  BASE_URLS: {
    weather: "https://api.openweathermap.org/data/2.5",
    aqi: "https://api.waqi.info/feed",
    ambee: "https://api.ambeedata.com",
    soil: "https://rest.isric.org/soilgrids/v2.0/properties/query",
    nasa: "https://api.nasa.gov/planetary",
    
  },

  TIMEOUT: 8000, // 8 sec
  RETRIES: 2,
};

// ===============================
// 🔑 ENV KEYS (SECURE)
// ===============================
const API_KEYS = {
  weather: import.meta.env.VITE_WEATHER_KEY,
  aqi: import.meta.env.VITE_WAQI_KEY,
  ambee: import.meta.env.VITE_AMBEE_KEY,
  soil: import.meta.env.VITE_SOIL_URL,
  nasa: import.meta.env.VITE_NASA_KEY,
};

// ===============================
// ⚙️ GENERIC FETCH CLIENT
// ===============================
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// ===============================
// 🔁 RETRY WRAPPER
// ===============================
const fetchWithRetry = async (fn, retries = CONFIG.RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    return fetchWithRetry(fn, retries - 1);
  }
};

// ===============================
// 📦 SAFE PARSER
// ===============================
const safe = (value, fallback = null) =>
  value !== undefined && value !== null ? value : fallback;

// ===============================
// 🌤 WEATHER SERVICE
// ===============================
export const WeatherAPI = {
  get: (lat, lon) =>
    fetchWithRetry(async () => {
      const data = await fetchWithTimeout(
        `${CONFIG.BASE_URLS.weather}/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.weather}&units=metric`
      );

      return {
        temp: safe(data?.main?.temp, 0),
        humidity: safe(data?.main?.humidity, 0),
        wind: safe(data?.wind?.speed, 0),
        windDeg: safe(data?.wind?.deg, 0),
        condition: safe(data?.weather?.[0]?.main, "N/A"),
      };
    }),
};

// ===============================
// 🌫 AQI SERVICE
// ===============================
export const AQIAPI = {
  get: (lat, lon) =>
    fetchWithRetry(async () => {
      const url = `${CONFIG.BASE_URLS.aqi}/geo:${lat};${lon}/?token=${API_KEYS.aqi}`;
      console.log('🌐 AQI API Request URL:', url);
      const data = await fetchWithTimeout(url);
      console.log('📊 AQI API Raw Response:', data);

      const result = {
        aqi: safe(data?.data?.aqi, 0),
        pm25: safe(data?.data?.iaqi?.pm25?.v, 0),
        pm10: safe(data?.data?.iaqi?.pm10?.v, 0),
      };
      console.log('📊 AQI API Parsed Result:', result);
      return result;
    }),
};

// ===============================
// ☀️ UV & DAYLIGHT SERVICE
// ===============================
export const UVAPI = {
  get: (lat, lon) =>
    fetchWithRetry(async () => {
      // Use UV endpoint (free tier) + Weather endpoint for sunrise/sunset
      const uvUrl = `${CONFIG.BASE_URLS.weather}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEYS.weather}`;
      const weatherUrl = `${CONFIG.BASE_URLS.weather}/weather?lat=${lat}&lon=${lon}&appid=${API_KEYS.weather}&units=metric`;
      
      console.log('🌐 UV API Request URL:', uvUrl);
      
      const [uvData, weatherData] = await Promise.all([
        fetchWithTimeout(uvUrl),
        fetchWithTimeout(weatherUrl),
      ]);
      
      console.log('☀️ UV API Raw Response:', uvData);
      console.log('☀️ Weather Raw Response (for sunrise/sunset):', weatherData);

      // Extract UV index from UV endpoint
      const uvIndex = safe(uvData?.value, 0);
      console.log('📍 UV API Extraction - UVI value:', uvIndex, 'type:', typeof uvIndex);
      
      // Calculate sunlight hours from sunrise/sunset in weather data
      const sunrise = safe(weatherData?.sys?.sunrise, 0);
      const sunset = safe(weatherData?.sys?.sunset, 0);
      console.log('📍 UV API Extraction - Sunrise:', sunrise, 'Sunset:', sunset);
      const sunlightSeconds = sunset - sunrise;
      const sunlightHours = Math.round((sunlightSeconds / 3600) * 10) / 10; // Round to 1 decimal
      console.log('📍 UV API Extraction - Sunlight calculation:', { sunlightSeconds, sunlightHours });

      // Estimate radiation (W/m²) based on UV index
      // Approximate formula: Radiation ≈ UV Index * 20 W/m²
      const radiationValue = Math.round(uvIndex * 20);
      console.log('📍 UV API Extraction - Radiation:', radiationValue, '(UVI', uvIndex, '* 20)');

      const result = {
        uvi: Math.round(uvIndex * 10) / 10, // Round to 1 decimal
        sunlightHours: sunlightHours || 10, // Fallback to 10
        radiationValue: radiationValue || 165, // Fallback to 165
      };

      console.log('✅ UV API FINAL RESULT (returned to component):', result);
      console.log('✅ Result type check:', { uvi: typeof result.uvi, sunlight: typeof result.sunlightHours, radiation: typeof result.radiationValue });
      return result;
    }),
};

// ===============================
// 🌿 POLLEN SERVICE (via Proxy)
// ===============================
export const PollenAPI = {
  get: (lat, lon) =>
    fetchWithRetry(async () => {
      try {
        // Use local proxy to avoid CORS issues
        const url = `/api/pollen?lat=${lat}&lng=${lon}`;
        
        console.log('🌿 Pollen Proxy Request:', url);
        
        const response = await fetchWithTimeout(url);
        
        console.log('🌿 Pollen Proxy Response:', response);
        
        // Extract pollen data from proxy response
        const pollenData = response?.data || {};
        
        if (pollenData && Object.keys(pollenData).length > 0) {
          console.log('✅ Pollen data received:', pollenData);
          
          // Calculate total pollen count
          const total = (pollenData.Grass || 0) + (pollenData.Tree || 0) + (pollenData.Weed || 0);
          
          // Determine risk level based on total count
          let riskLevel = 'Low';
          if (total > 150) riskLevel = 'High';
          else if (total > 80) riskLevel = 'Moderate';
          
          return {
            pollenCount: total || 320,
            grass: pollenData.Grass || 120,
            tree: pollenData.Tree || 85,
            weed: pollenData.Weed || 115,
            riskLevel: riskLevel,
            vegetationIndex: pollenData.vegetationIndex || 65,
            timestamp: new Date().toISOString(),
            source: 'Ambee Pollen API',
          };
        }
      } catch (error) {
        console.log('ℹ️ Pollen API unavailable:', error.message);
      }
      
      // Fallback: Generate realistic location-based mock pollen data
      console.log('📊 Generating location-based mock pollen data for coordinates:', { lat, lon });
      
      const hash = Math.abs(Math.sin(lat + lon) * 10000);
      const seed = hash - Math.floor(hash);
      
      const isUrban = (Math.abs(lat) < 40 && Math.abs(lon) < 120);
      const isSpring = true; // Could use date if needed
      
      let grassPollen = 80 + seed * 100;
      let treePollen = 50 + seed * 80;
      let weedPollen = 70 + seed * 100;
      
      if (isUrban) {
        grassPollen *= 0.8;
        treePollen *= 1.2;
        weedPollen *= 1.3;
      }
      
      if (isSpring) {
        treePollen *= 1.5;
      }
      
      const total = Math.round(grassPollen + treePollen + weedPollen);
      let riskLevel = 'Low';
      if (total > 150) riskLevel = 'High';
      else if (total > 80) riskLevel = 'Moderate';
      
      const vegIndex = Math.min(100, 40 + seed * 60);
      
      return {
        pollenCount: total,
        grass: Math.round(grassPollen),
        tree: Math.round(treePollen),
        weed: Math.round(weedPollen),
        riskLevel: riskLevel,
        vegetationIndex: Math.round(vegIndex),
        timestamp: new Date().toISOString(),
        source: 'Simulated Pollen Data',
      };
    }),
};

// ===============================
// 🌱 SOIL SERVICE
// ===============================
export const SoilAPI = {
  get: (lat, lon) =>
    fetchWithRetry(async () => {
      const url = `${CONFIG.BASE_URLS.soil}?lat=${lat}&lon=${lon}&property=phh2o,soc,bdod&depth=0-5cm`;
      console.log('🌱 Soil API Request URL:', url);
      
      const data = await fetchWithTimeout(url);
      console.log('🌱 Soil API Raw Response:', data);
      
      const result = safe(data?.properties, {});
      console.log('🌱 Soil API Parsed Result:', result);
      
      return result;
    }),
};

// ===============================
// 🌍 NASA SERVICE
// ===============================
export const EcosystemAPI = {
  get: () =>
    fetchWithRetry(async () => {
      const data = await fetchWithTimeout(
        `${CONFIG.BASE_URLS.nasa}/apod?api_key=${API_KEYS.nasa}`
      );

      return safe(data, {});
    }),
};

// ===============================
// 💧 WATER QUALITY SERVICE (via Proxy)
// ===============================
export const WaterAPI = {
  get: (lat, lon) =>
    fetchWithRetry(async () => {
      try {
        // Use local proxy to avoid CORS issues
        const url = `/api/water?lat=${lat}&lng=${lon}`;
        
        console.log('💧 Water Quality Proxy Request:', url);
        
        const response = await fetchWithTimeout(url);
        
        console.log('💧 Water Quality Proxy Response:', response);
        
        // Extract water quality data from proxy response
        const waterData = response?.data || {};
        
        if (waterData && Object.keys(waterData).length > 0) {
          console.log('✅ Water quality data received:', waterData);
          
          return {
            sitesCount: 1,
            ph: waterData.pH || 7.0,
            temperature: waterData.temperature || 20,
            dissolvedOxygen: waterData.dissolvedOxygen || 7.5,
            turbidity: waterData.turbidity || 2.0,
            conductivity: waterData.conductivity || 500,
            siteName: `Water Quality (${Math.abs(lat).toFixed(2)}°, ${Math.abs(lon).toFixed(2)}°)`,
            timestamp: new Date().toISOString(),
            source: 'Ambee Water Quality API',
          };
        }
      } catch (error) {
        console.log('ℹ️ Water quality API unavailable:', error.message);
      }
      
      // Fallback: Generate realistic location-based mock data
      console.log('📊 Generating location-based mock water quality data for coordinates:', { lat, lon });
      
      const hash = Math.abs(Math.sin(lat + lon) * 10000);
      const seed = hash - Math.floor(hash);
      
      const isUrban = (Math.abs(lat) < 40 && Math.abs(lon) < 120);
      const isCoastal = Math.abs(lat) > 40 || Math.abs(lon) > 100;
      
      let baseTemp = 15 + (30 - Math.abs(lat)) * 0.5;
      let basePH = 7.0 + (seed - 0.5) * 1.0;
      let baseDO = 7.5 + (seed - 0.5) * 2.0;
      let baseTurbidity = 1.5 + (isUrban ? seed : 0) * 2.0;
      
      if (isUrban) {
        basePH += (seed - 0.5) * 0.8;
        baseDO -= seed * 0.5;
        baseTurbidity += 1.0;
      }
      
      if (isCoastal) {
        basePH = 7.8 + (seed - 0.5) * 0.5;
        baseTurbidity += 0.5;
      }
      
      return {
        sitesCount: 0,
        ph: Math.max(6.0, Math.min(9.0, basePH)),
        temperature: Math.round(baseTemp * 10) / 10,
        dissolvedOxygen: Math.max(4.0, Math.min(9.0, baseDO)),
        turbidity: Math.max(0.5, Math.min(8.0, baseTurbidity)),
        conductivity: 300 + seed * 400,
        siteName: `Water Quality (${Math.abs(lat).toFixed(1)}°, ${Math.abs(lon).toFixed(1)}°)`,
        timestamp: new Date().toISOString(),
        source: 'Simulated Data',
      };
    }),
};

// ===============================
// �🌍 AGGREGATOR (PARALLEL)
// ===============================
export const EnvironmentAPI = {
  getAll: async (lat, lon) => {
    try {
      const results = await Promise.allSettled([
        WeatherAPI.get(lat, lon),
        AQIAPI.get(lat, lon),
        WaterAPI.get(lat, lon),
        PollenAPI.get(lat, lon),
        SoilAPI.get(lat, lon),
        EcosystemAPI.get(),
      ]);

      return {
        weather: results[0].status === "fulfilled" ? results[0].value : null,
        aqi: results[1].status === "fulfilled" ? results[1].value : null,
        water: results[2].status === "fulfilled" ? results[2].value : null,
        pollen: results[3].status === "fulfilled" ? results[3].value : null,
        soil: results[4].status === "fulfilled" ? results[4].value : null,
        ecosystem: results[5].status === "fulfilled" ? results[5].value : null,
      };
    } catch (error) {
      console.error("EnvironmentAPI Error:", error);
      return null;
    }
  },
};