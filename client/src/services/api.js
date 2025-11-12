import axios from 'axios'
import { auth } from './firebase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function getAuthToken() {
  const current = auth.currentUser;
  if (!current) return null;
  return current.getIdToken();
}

async function request(method, path, data) {
  const token = await getAuthToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axios({ method, url: `${API_URL}${path}`, data, headers });
}

export const api = {
  listModels: () => request('get', '/api/models'),
  getModel: (id) => request('get', `/api/models/${id}`),
  createModel: (payload) => request('post', '/api/models', payload),
  updateModel: (id, payload) => request('put', `/api/models/${id}`, payload),
  deleteModel: (id) => request('delete', `/api/models/${id}`)
}

// Public endpoints and purchases
api.listPublicModels = (params) => {
  if (!params) return request('get', '/api/public/models');
  // remove undefined/null values
  const entries = Object.entries(params).filter(([k, v]) => v !== undefined && v !== null && v !== '');
  const qs = entries.length ? `?${new URLSearchParams(Object.fromEntries(entries)).toString()}` : '';
  return request('get', `/api/public/models${qs}`);
}
api.listPublicFrameworks = () => request('get', '/api/public/frameworks');
api.purchaseModel = (id) => request('post', `/api/models/${id}/purchase`);
api.getMyPurchases = () => request('get', '/api/purchases/my');
api.rateModel = (id, rating) => request('post', `/api/models/${id}/rate`, { rating });

export default api;
