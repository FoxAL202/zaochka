import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RequestItem, Category } from '../../types';
import { REQUEST_STATUSES } from '../../types';
import * as requestsApi from '../../api/requests';
import * as categoriesApi from '../../api/categories';
import styles from './Catalog.module.css';

const ITEMS_PER_PAGE = 10;

export default function Catalog() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    requestsApi
      .getRequests(page, ITEMS_PER_PAGE, {
        categoryId: filterCategory || undefined,
        status: filterStatus || undefined,
      })
      .then((res) => {
        setRequests(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, filterCategory, filterStatus]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const statusLabel = (s: string) =>
    REQUEST_STATUSES.find((st) => st.value === s)?.label || s;

  return (
    <div>
      <h1 className={styles.title}>Каталог заявок</h1>

      <div className={styles.filters}>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Все статусы</option>
          {REQUEST_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : requests.length === 0 ? (
        <p className={styles.empty}>Заявок пока нет</p>
      ) : (
        <>
          <div className={styles.grid}>
            {requests.map((r) => (
              <Link
                to={`/request/${r.id}`}
                key={r.id}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <h3>{r.title}</h3>
                  <span
                    className={`${styles.status} ${styles[`status_${r.status}`]}`}
                  >
                    {statusLabel(r.status)}
                  </span>
                </div>
                <p className={styles.cardDesc}>{r.description}</p>
                <div className={styles.cardMeta}>
                  <span>{r.userName}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Назад
              </button>
              <span>
                {page} из {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
