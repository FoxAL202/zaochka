import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { RequestItem } from '../../types';
import { REQUEST_STATUSES } from '../../types';
import * as requestsApi from '../../api/requests';
import styles from './MyRequests.module.css';

export default function MyRequests() {
  const { user } = useSelector((s: RootState) => s.auth);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    requestsApi
      .getMyRequests(user.id)
      .then(setRequests)
      .finally(() => setLoading(false));
  }, [user]);

  const statusLabel = (s: string) =>
    REQUEST_STATUSES.find((st) => st.value === s)?.label || s;

  if (loading) return <p className={styles.center}>Загрузка...</p>;

  return (
    <div>
      <h1 className={styles.title}>Мои заявки</h1>

      {requests.length === 0 ? (
        <div className={styles.center}>
          <p>У вас пока нет заявок</p>
          <Link to="/create">Создать заявку</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {requests.map((r) => (
            <Link
              to={`/request/${r.id}`}
              key={r.id}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <h3>{r.title}</h3>
                <span
                  className={`${styles.status} ${styles[`status_${r.status}`]}`}
                >
                  {statusLabel(r.status)}
                </span>
              </div>
              <p className={styles.desc}>{r.description}</p>
              <span className={styles.date}>
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
