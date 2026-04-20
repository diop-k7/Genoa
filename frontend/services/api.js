import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANT : adapte UNE seule ligne selon ton cas

// iPhone simulateur (Mac)
const API_URL = 'http://localhost:3000';

// Téléphone physique → remplace avec ton IP (ex: 192.168.1.10)
// const API_URL = 'http://192.168.X.X:3000';

// Android emulator
// const API_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter automatiquement le token
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