import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Changez cette URL selon votre configuration
// Pour émulateur Android: http://10.0.2.2:3000
// Pour appareil physique: http://localhost:3000
 const API_URL = 'https://swift-moons-behave.loca.lt';

const api = axios.create({
  baseURL: API_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;