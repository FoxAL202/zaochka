import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { RequestItem, Category } from '../../types';
import { REQUEST_STATUSES } from '../../types';
import * as requestsApi from '../../api/requests';
import * as categoriesApi from '../../api/categories';
import styles from './RequestDetail.module.css';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [category, setCategory] = useState<Category | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    requestsApi
      .getRequestById(id)
      .then((r) => {
        setRequest(r);
        if (r) {
          categoriesApi.getCategories().then((cats) => {
            setCategory(cats.find((c) => c.id === r.categoryId));
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={styles.center}>Загрузка...</p>;
  if (!request)
    return (
      <div className={styles.center}>
        <p>Заявка не найдена</p>
        <Link to="/">Вернуться в каталог</Link>
      </div>
    );

  const statusLabel = REQUEST_STATUSES.find((s) => s.value === request.status)
    ?.label;

  return (
    <div className={styles.wrapper}>
      <Link to="/" className={styles.back}>
        ← Назад
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{request.title}</h1>
          <span className={`${styles.status} ${styles[`status_${request.status}`]}`}>
            {statusLabel}
          </span>
        </div>

        <div className={styles.section}>
          <h3>Описание</h3>
          <p>{request.description}</p>
        </div>

        <div className={styles.meta}>
          <div>
            <span className={styles.label}>Автор</span>
            <span>{request.userName}</span>
          </div>
          <div>
            <span className={styles.label}>Email</span>
            <span>{request.email}</span>
          </div>
          <div>
            <span className={styles.label}>Категория</span>
            <span>{category?.name || '—'}</span>
          </div>
          <div>
            <span className={styles.label}>Создана</span>
            <span>{new Date(request.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className={styles.label}>Обновлена</span>
            <span>{new Date(request.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        {request.files.length > 0 && (
          <div className={styles.section}>
            <h3>Файлы</h3>
            <div className={styles.files}>
              {request.files.map((f, i) => (
                <a
                  key={i}
                  href={f}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.fileLink}
                >
                  {f.startsWith('data:image') ? (
                    <img src={f} alt={`file-${i}`} className={styles.preview} />
                  ) : (
                    <span>Файл {i + 1}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
