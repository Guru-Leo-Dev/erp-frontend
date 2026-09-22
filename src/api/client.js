const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = (data && data.error) || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return data;
}

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  return '?' + new URLSearchParams(entries).toString();
}

// Builds a standard { list, get, create, update, remove } set for a resource.
function resource(path) {
  return {
    list: (params) => request(`${path}${buildQuery(params)}`),
    get: (id) => request(`${path}/${id}`),
    create: (body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`${path}/${id}`, { method: 'DELETE' }),
  };
}

export const api = {
  customers: resource('/customers'),
  vendors: resource('/vendors'),
  stores: resource('/stores'),
  items: {
    ...resource('/items'),
    categories: () => request('/items/meta/categories'),
  },
  salesOrders: resource('/sales-orders'),
  purchaseOrders: resource('/purchase-orders'),
  shipments: resource('/shipments'),
  invoices: resource('/invoices'),
  dashboard: {
    stats: () => request('/dashboard/stats'),
  },
};
