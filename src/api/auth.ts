import type { AuthUser, User, AuthResponse } from '../types';
import { STORAGE_KEYS, delay, getItem, setItem, generateId } from './client';

function fakeToken(): string {
  return 'jwt_' + generateId() + generateId();
}

function getUserByEmail(email: string): AuthUser | undefined {
  return getItem<AuthUser>(STORAGE_KEYS.USERS).find((u) => u.email === email);
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  await delay();
  if (getUserByEmail(email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  const users = getItem<AuthUser>(STORAGE_KEYS.USERS);
  const isFirst = users.length === 0;
  const user: AuthUser = {
    id: generateId(),
    email,
    password,
    name,
    role: isFirst ? 'admin' : 'user',
  };
  users.push(user);
  setItem(STORAGE_KEYS.USERS, users);
  const token = fakeToken();
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }));
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  await delay();
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error('Неверный email или пароль');
  }
  const token = fakeToken();
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }));
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
}

export async function logout(): Promise<void> {
  await delay();
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export async function getMe(): Promise<User | null> {
  await delay(100);
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
