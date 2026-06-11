import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import type { Category } from '../../types';
import * as categoriesApi from '../../api/categories';
import * as requestsApi from '../../api/requests';
import styles from './CreateRequest.module.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export default function CreateRequest() {
  const { user } = useSelector((s: RootState) => s.auth);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [categoryId, setCategoryId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesApi.getCategories().then(setCategories);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const invalid = selected.find(
      (f) => !ACCEPTED_TYPES.includes(f.type)
    );
    if (invalid) {
      setError('Допустимы только JPG, PNG и PDF');
      return;
    }
    setError('');
    setFiles(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!categoryId) {
      setError('Выберите категорию');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fileData: string[] = [];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        fileData.push(base64);
      }

      await requestsApi.createRequest({
        title,
        description,
        email,
        categoryId,
        files: fileData,
        status: 'new',
        userId: user.id,
        userName: user.name,
      });

      navigate('/my-requests');
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Новая заявка</h1>

        {error && <div className={styles.error}>{error}</div>}

        <label>
          Название
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Описание
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </label>

        <label>
          Email для связи
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Категория
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Файлы (JPG, PNG, PDF)
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            multiple
            onChange={handleFileChange}
          />
        </label>

        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((f, i) => (
              <span key={i}>{f.name}</span>
            ))}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : 'Создать заявку'}
        </button>
      </form>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
