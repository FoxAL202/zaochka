const DELAY = 300;

const STORAGE_KEYS = {
  USERS: 'zaochka_users',
  CATEGORIES: 'zaochka_categories',
  REQUESTS: 'zaochka_requests',
  TOKEN: 'zaochka_token',
  CURRENT_USER: 'zaochka_user',
} as const;

function delay(ms = DELAY): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function getItem<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export { STORAGE_KEYS, delay, getItem, setItem, generateId };
