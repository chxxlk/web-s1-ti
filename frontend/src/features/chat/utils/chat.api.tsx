/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Jika backend route streaming di /chat/stream (tanpa /api), atur BASE tanpa /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// (Opsional) jika semua API di prefix /api, tetap bisa pakai `/api`
const AXIOS_BASE = API_BASE_URL + '/api';

const apiClient = axios.create({
  baseURL: AXIOS_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use((c) => c, (e) => Promise.reject(e));
apiClient.interceptors.response.use((r) => r, (e) => {
  if (e.response?.status === 422) {
    const errors = e.response.data.errors;
    const first = Object.values(errors)[0];
    e.message = Array.isArray(first) ? first[0] : first;
  }
  return Promise.reject(e);
});

export const sendChatMessage = async (message: string, sessionId = 'default') => {
  const response = await apiClient.post('/chat', { message, session_id: sessionId });
  return response.data;
};

export const streamChat = (
  message: string,
  sessionId = 'default',
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: any) => void
) => {
  // Jika streaming ada di /api/chat/stream
  const url = new URL(API_BASE_URL + '/api/chat/stream');
  url.searchParams.append('message', message);
  url.searchParams.append('session_id', sessionId);

  const es = new EventSource(url.toString(), {
    withCredentials: false,
  });

  es.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      if (data.chunk) onChunk(data.chunk);
      if (data.done) {
        onDone();
        es.close();
      }
    } catch (e) {
      console.error('SSE parse error:', e, evt.data);
    }
  };

  es.onerror = (err) => {
    console.error('SSE connection error:', err);
    onError(err);
    es.close();
  };

  return es;
};

// Sisanya tidak banyak berubah
export const getChatHistory = async (sessionId = 'default') => {
  const resp = await apiClient.get('/history', { params: { session_id: sessionId } });
  return resp.data;
};

export const testConnection = async () => {
  const resp = await apiClient.get('/test');
  return resp.data;
};

export const testDatabase = async () => {
  const resp = await apiClient.get('/test-db');
  return resp.data;
};

export const getChatbotInfo = async () => {
  const resp = await apiClient.get('/chatbot/info');
  return resp.data;
};

export const getWelcomeMessage = async () => {
  const resp = await apiClient.get('/chatbot/welcome');
  return resp.data;
};
