import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RequestItem, Category } from '../../types';
import { REQUEST_STATUSES } from '../../types';
import * as requestsApi from '../../api/requests';
import * as categoriesApi from '../../api/categories';
import styles from './AdminRequests.module.css';

const ITEMS_PER_PAGE = 10;

export default function AdminRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
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
  };

  useEffect(() => {
    categoriesApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    load();
  }, [page, filterCategory, filterStatus]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleStatusChange = async (id: string, status: RequestItem['status']) => {
    try {
      await requestsApi.updateRequestStatus(id, status);
      load();
    } catch (err) {
      alert('Ошибка при изменении статуса');
    }
  };

  const statusLabel = (s: string) =>
    REQUEST_STATUSES.find((st) => st.value === s)?.label || s;
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || '—';

  return (
    <div>
      <h1 className={styles.title}>Управление заявками</h1>

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

        <span className={styles.total}>Всего: {total}</span>
      </div>

      {loading ? (
        <p className={styles.center}>Загрузка...</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Email</th>
                  <th>Категория</th>
                  <th>Статус</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.id}>{r.id.slice(0, 8)}</td>
                    <td>
                      <Link to={`/request/${r.id}`} className={styles.link}>
                        {r.title}
                      </Link>
                    </td>
                    <td>{r.email}</td>
                    <td>{categoryName(r.categoryId)}</td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[`status_${r.status}`]}`}
                      >
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td className={styles.date}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) =>
                          handleStatusChange(
                            r.id,
                            e.target.value as RequestItem['status']
                          )
                        }
                        className={styles.statusSelect}
                      >
                        {REQUEST_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.empty}>
                      Нет заявок
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
