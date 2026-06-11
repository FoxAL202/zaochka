import type { Category } from '../types';
import { STORAGE_KEYS, delay, getItem, setItem, generateId } from './client';

export async function getCategories(): Promise<Category[]> {
  await delay();
  return getItem<Category>(STORAGE_KEYS.CATEGORIES);
}

export async function createCategory(
  name: string
): Promise<Category> {
  await delay();
  const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
  if (categories.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Категория с таким названием уже существует');
  }
  const category: Category = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
  };
  categories.push(category);
  setItem(STORAGE_KEYS.CATEGORIES, categories);
  return category;
}

export async function updateCategory(
  id: string,
  name: string
): Promise<Category> {
  await delay();
  const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Категория не найдена');
  if (categories.find((c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== id)) {
    throw new Error('Категория с таким названием уже существует');
  }
  categories[idx] = { ...categories[idx], name };
  setItem(STORAGE_KEYS.CATEGORIES, categories);
  return categories[idx];
}

export async function deleteCategory(id: string): Promise<void> {
  await delay();
  let categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
  categories = categories.filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.CATEGORIES, categories);
}
