export const API_URL = 'http://localhost:8000/api';

export async function fetchHostedZones() {
  const res = await fetch(`${API_URL}/hostedzones`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch hosted zones');
  return res.json();
}

export async function fetchHostedZone(id: string) {
  const res = await fetch(`${API_URL}/hostedzones/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch hosted zone');
  return res.json();
}

export async function createHostedZone(data: { name: string; comment?: string; is_private?: boolean }) {
  const res = await fetch(`${API_URL}/hostedzones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create hosted zone');
  return res.json();
}

export async function deleteHostedZone(id: string) {
  const res = await fetch(`${API_URL}/hostedzones/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete hosted zone');
  return res.json();
}

// Records API
export async function fetchRecords(zoneId: string) {
  const res = await fetch(`${API_URL}/hostedzones/${zoneId}/records`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch records');
  return res.json();
}

export async function createRecord(zoneId: string, data: { name: string; type: string; value: string; ttl: number; routing_policy: string }) {
  const res = await fetch(`${API_URL}/hostedzones/${zoneId}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create record');
  return res.json();
}

export async function deleteRecord(recordId: string) {
  const res = await fetch(`${API_URL}/records/${recordId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete record');
  return res.json();
}
