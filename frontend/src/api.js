// src/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error('Login failed');
  return await res.json();
}

export async function createEvent(data, token) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  const res = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('Event creation failed');
  return await res.json();
}
