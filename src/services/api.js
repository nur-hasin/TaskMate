import {
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
} from './authStorage';

const API_BASE_URL = (
  __DEV__
    ? process.env.EXPO_PUBLIC_LOCAL_API_URL
    : process.env.EXPO_PUBLIC_PRODUCTION_API_URL
)?.replace(/\/$/, '');

if (!API_BASE_URL) {
  throw new Error('API URL is not configured for this environment.');
}

async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = true } = options;
  const headers = { Accept: 'application/json' };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Could not connect to the API at ${API_BASE_URL}. Check that the backend is running and the API URL is correct.`
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) {
      await clearAccessToken().catch(() => {});
    }

    const error = new Error(result?.message || 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }

  return result?.data;
}

export async function register(input) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: input,
    auth: false,
  });

  await saveAccessToken(data.accessToken);
  return data.user;
}

export async function login(input) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: input,
    auth: false,
  });

  await saveAccessToken(data.accessToken);
  return data.user;
}

export async function getCurrentUser() {
  const data = await apiRequest('/auth/me');
  return data.user;
}

export async function getTasks() {
  const data = await apiRequest('/tasks');
  return data.tasks;
}

export async function createTask(input) {
  const data = await apiRequest('/tasks', {
    method: 'POST',
    body: input,
  });
  return data.task;
}

export async function updateTask(id, input) {
  const data = await apiRequest(`/tasks/${id}`, {
    method: 'PATCH',
    body: input,
  });
  return data.task;
}

export async function deleteTask(id) {
  return apiRequest(`/tasks/${id}`, { method: 'DELETE' });
}
