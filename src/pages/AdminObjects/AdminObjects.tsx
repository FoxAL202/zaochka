import { useEffect, useState } from 'react';
import type { Category } from '../../types';
import * as categoriesApi from '../../api/categories';
import styles from './AdminObjects.module.css';

export default function AdminObjects() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    categoriesApi.getCategories().then(setCategories).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    try {
      await categoriesApi.createCategory(newName.trim());
      setNewName('');
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setError('');
    try {
      await categoriesApi.updateCategory(id, editName.trim());
      setEditId(null);
      setEditName('');
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию?')) return;
    try {
      await categoriesApi.deleteCategory(id);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className={styles.center}>Загрузка...</p>;

  return (
    <div>
      <h1 className={styles.title}>Управление категориями</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.createForm} onSubmit={handleCreate}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Название категории"
          required
        />
        <button type="submit">Добавить</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className={styles.id}>{c.id}</td>
              <td>
                {editId === c.id ? (
                  <div className={styles.inlineEdit}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(c.id)}>Сохранить</button>
                    <button onClick={() => setEditId(null)}>Отмена</button>
                  </div>
                ) : (
                  c.name
                )}
              </td>
              <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditId(c.id);
                    setEditName(c.name);
                  }}
                >
                  ✏
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(c.id)}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.empty}>
                Нет категорий
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
