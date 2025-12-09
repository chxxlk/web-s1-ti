import axios from 'axios';

// Base URL untuk Laravel 12.x backend
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

// Buat instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Tambahkan interceptor untuk logging
apiClient.interceptors.request.use(
  (config) => {
    // console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response || error.message);
    
    // Handle Laravel validation errors
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0];
      error.message = Array.isArray(firstError) ? firstError[0] : firstError;
    }
    
    return Promise.reject(error);
  }
);

export const sendChatMessage = async (message: string, sessionId: string = 'default') => {
  try {
    // console.log("Sending message to Laravel backend:", message);
    
    const response = await apiClient.post('/chat', {
      message,
      session_id: sessionId
    });
    
    // console.log("Response from Laravel:", response.data);
    return response.data;
  } catch (error: any) {
    console.error('Full error details from Laravel API:', error);
    
    // Berikan error message yang lebih spesifik
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Tidak dapat terhubung ke backend Laravel. Pastikan server berjalan di port 8000.');
    } else if (error.response?.status === 404) {
      throw new Error('Endpoint API tidak ditemukan. Periksa routes Laravel.');
    } else if (error.response?.status === 500) {
      throw new Error('Error internal server di backend Laravel. Periksa log Laravel.');
    } else if (error.response?.data?.error) {
      throw new Error(`Error Laravel: ${error.response.data.error}`);
    } else {
      throw new Error(`Gagal mengirim pesan: ${error.message || 'Error tidak diketahui'}`);
    }
  }
};

/**
 * Mengambil riwayat chat sesuai dengan session ID.
 * Jika session ID tidak disediakan, maka default session ID adalah 'default'.
 * 
 * @param {string} sessionId - Session ID yang ingin diambil riwayat chatnya.
 * @returns {Promise<object[]>} - Promise yang berisi dengan riwayat chat yang diambil.
 * @throws {Error} - Jika terjadi error dalam mengambil riwayat chat, maka akan dilempar error dengan pesan yang sesuai.
 */
export const getChatHistory = async (sessionId: string = 'default') => {
  try {
    const response = await apiClient.get('/history', {
      params: { session_id: sessionId }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Tidak dapat terhubung ke backend Laravel. Pastikan server berjalan di port 8000.');
    } else {
      throw new Error('Gagal mengambil riwayat chat');
    }
  }
};

/**
 * Menguji koneksi ke backend Laravel.
 * Jika koneksi gagal, maka akan dilempar error dengan pesan yang sesuai.
 * 
 * @returns {Promise<object>} - Promise yang berisi dengan hasil tes koneksi.
 * @throws {Error} - Jika terjadi error dalam menguji koneksi, maka akan dilempar error dengan pesan yang sesuai.
 */
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/test');
    return response.data;
  } catch (error: any) {
    console.error('Connection test failed:', error);
    throw new Error(`Test koneksi backend gagal: ${error.message}`);
  }
};

/**
 * Menguji koneksi ke database Laravel.
 * Jika koneksi gagal, maka akan dilempar error dengan pesan yang sesuai.
 * 
 * @returns {Promise<object>} - Promise yang berisi dengan hasil tes koneksi ke database.
 * @throws {Error} - Jika terjadi error dalam menguji koneksi ke database, maka akan dilempar error dengan pesan yang sesuai.
**/
export const testDatabase = async () => {
  try {
    const response = await apiClient.get('/test-db');
    return response.data;
  } catch (error: any) {
    console.error('Database test failed:', error);
    throw new Error(`Test database gagal: ${error.message}`);
  }
};

/**
 * Mengambil informasi tentang chatbot.
 * Informasi yang diambil termasuk nama, deskripsi, dan versi.
 * Jika gagal mengambil informasi, maka akan dilempar error dengan pesan yang sesuai.
 * 
 * @returns {Promise<object>} - Promise yang berisi dengan informasi chatbot.
 * @throws {Error} - Jika terjadi error dalam mengambil informasi, maka akan dilempar error dengan pesan yang sesuai.
**/
export const getChatbotInfo = async () => {
  try {
    const response = await apiClient.get('/chatbot/info');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get chatbot info:', error);
    throw new Error(`Gagal mengambil informasi chatbot: ${error.message}`);
  }
};

/**
 * Mengambil pesan welcome dari backend Laravel.
 * Pesan welcome ini akan ditampilkan ketika user pertama kali membuka chatbot.
 * Jika gagal mengambil pesan welcome, maka akan dilempar error dengan pesan yang sesuai.
 * 
 * @returns {Promise<object>} - Promise yang berisi dengan pesan welcome.
 * @throws {Error} - Jika terjadi error dalam mengambil pesan welcome, maka akan dilempar error dengan pesan yang sesuai.
**/
export const getWelcomeMessage = async () => {
  try {
    const response = await apiClient.get('/chatbot/welcome');
    return response.data;
  } catch (error: any) {
    console.error('Failed to get welcome message:', error);
    throw new Error(`Gagal mengambil pesan welcome: ${error.message}`);
  }
};