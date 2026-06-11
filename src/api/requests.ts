import type { RequestItem, PaginatedResponse } from '../types';
import { STORAGE_KEYS, delay, getItem, setItem, generateId } from './client';

export async function getRequests(
  page = 1,
  limit = 10,
  filters?: { categoryId?: string; status?: string }
): Promise<PaginatedResponse<RequestItem>> {
  await delay();
  let requests = getItem<RequestItem>(STORAGE_KEYS.REQUESTS);

  if (filters?.categoryId) {
    requests = requests.filter((r) => r.categoryId === filters.categoryId);
  }
  if (filters?.status) {
    requests = requests.filter((r) => r.status === filters.status);
  }

  requests.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = requests.length;
  const start = (page - 1) * limit;
  const data = requests.slice(start, start + limit);

  return { data, total, page, limit };
}

export async function getRequestById(
  id: string
): Promise<RequestItem | null> {
  await delay();
  return getItem<RequestItem>(STORAGE_KEYS.REQUESTS).find((r) => r.id === id) || null;
}

export async function getMyRequests(
  userId: string
): Promise<RequestItem[]> {
  await delay();
  return getItem<RequestItem>(STORAGE_KEYS.REQUESTS)
    .filter((r) => r.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function createRequest(
  data: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RequestItem> {
  await delay();
  const requests = getItem<RequestItem>(STORAGE_KEYS.REQUESTS);
  const request: RequestItem = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  requests.push(request);
  setItem(STORAGE_KEYS.REQUESTS, requests);
  return request;
}

export async function updateRequestStatus(
  id: string,
  status: RequestItem['status']
): Promise<RequestItem> {
  await delay();
  const requests = getItem<RequestItem>(STORAGE_KEYS.REQUESTS);
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error('Заявка не найдена');
  requests[idx] = { ...requests[idx], status, updatedAt: new Date().toISOString() };
  setItem(STORAGE_KEYS.REQUESTS, requests);
  return requests[idx];
}
