/* global process */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const AMBEE_API_KEY = process.env.VITE_AMBEE_KEY;
const AMBEE_BASE_URL = 'https://api.ambeedata.com';

// Log startup info
console.log('🔑 API Key Status:', AMBEE_API_KEY ? '✅ Loaded' : '❌ Missing - check .env file');
console.log('📍 Ambee Base URL:', AMBEE_BASE_URL);

// 💧 Water Quality Proxy
app.get('/api/water', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng required' });
    }

    if (!AMBEE_API_KEY) {
      console.error('❌ Missing API key - returning mock data');
      return handleFallback(res);
    }

    console.log('🌐 Proxying water quality request:', { lat, lng });

    const response = await fetch(
      `${AMBEE_BASE_URL}/water/latest/by-lat-lng?lat=${lat}&lng=${lng}`,
      {
        headers: {
          'x-api-key': AMBEE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📡 Ambee response status:', response.status);

    if (!response.ok) {
      console.error(`❌ Ambee API error: ${response.status}`);
      return handleFallback(res);
    }

    const data = await response.json();
    console.log('✅ Water quality data received');
    
    res.json({
      data: data,
      source: 'Ambee Water Quality API',
    });
  } catch (error) {
    console.error('❌ Water quality proxy error:', error.message);
    handleFallback(res);
  }
});

// Fallback handler - returns mock data
const handleFallback = (res) => {
  const mockData = {
    pH: 7.2,
    temperature: 22,
    dissolvedOxygen: 7.5,
    turbidity: 2.0,
    conductivity: 500,
  };
  
  res.json({
    data: mockData,
    source: 'Mock Data (Fallback)',
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server running', 
    timestamp: new Date().toISOString(),
    apiKeySet: !!AMBEE_API_KEY,
  });
});

// 🌿 Pollen Proxy
app.get('/api/pollen', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng required' });
    }

    if (!AMBEE_API_KEY) {
      console.error('❌ Missing API key - returning mock pollen data');
      return handlePollenFallback(res);
    }

    console.log('🌐 Proxying pollen data request:', { lat, lng });

    const response = await fetch(
      `${AMBEE_BASE_URL}/latest/pollen/by-lat-lng?lat=${lat}&lng=${lng}`,
      {
        headers: {
          'x-api-key': AMBEE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📡 Ambee pollen response status:', response.status);

    if (!response.ok) {
      console.error(`❌ Ambee Pollen API error: ${response.status}`);
      return handlePollenFallback(res);
    }

    const data = await response.json();
    console.log('✅ Pollen data received');
    
    res.json({
      data: data,
      source: 'Ambee Pollen API',
    });
  } catch (error) {
    console.error('❌ Pollen proxy error:', error.message);
    handlePollenFallback(res);
  }
});

// Pollen fallback handler - returns realistic mock data
const handlePollenFallback = (res) => {
  const mockPollen = {
    Grass: 120,
    Tree: 85,
    Weed: 115,
    count: 320,
    risk: 'High',
  };
  
  res.json({
    data: mockPollen,
    source: 'Mock Pollen Data (Fallback)',
  });
};

const PORT = process.env.VITE_PROXY_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`   Water API: http://localhost:${PORT}/api/water?lat=28.6139&lng=77.2090`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});
