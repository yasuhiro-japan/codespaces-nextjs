import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Trip } from '../src/types/trip';
import { getTrips, addTrip } from '../src/lib/store';
import styles from '../styles/tripplan.module.css';

const COVER_OPTIONS = ['✈️', '🗺️', '🏔️', '🌊', '🌸', '🍜', '🏯', '🎌', '🌅', '🚂'];

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(s)} 〜 ${fmt(e)}`;
}

function calcDays(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  return Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
}

interface CreateForm {
  cover: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}

const defaultForm = (): CreateForm => ({
  cover: '✈️',
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
});

export default function HomePage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateForm>(defaultForm());

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  const openModal = () => {
    setForm(defaultForm());
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleCreate = () => {
    if (!form.title.trim() || !form.destination.trim() || !form.startDate || !form.endDate) return;
    const trip = addTrip({
      cover: form.cover,
      title: form.title.trim(),
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
    });
    setTrips(getTrips());
    closeModal();
    router.push(`/trips/${trip.id}`);
  };

  const isFormValid =
    form.title.trim() && form.destination.trim() && form.startDate && form.endDate && form.startDate <= form.endDate;

  return (
    <div className={styles.app}>
      <Head>
        <title>TripPlan — 旅行プランを管理・共有</title>
        <meta name="description" content="旅行の日程・スポット・費用を管理して、URLで仲間に共有できる旅行プランアプリ" />
        <meta property="og:title" content="TripPlan" />
        <meta property="og:description" content="旅行の日程・スポット・費用を管理して、URLで仲間に共有できる旅行プランアプリ" />
        <meta property="og:type" content="website" />
      </Head>
      <div className={styles.homeHeader}>
        <h1 className={styles.homeTitle}>TripPlan</h1>
        <button className={styles.addBtn} onClick={openModal}>
          + 旅行を追加
        </button>
      </div>

      {trips.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🗺️</div>
          <p className={styles.emptyText}>旅行プランがまだありません</p>
          <p className={styles.emptySubText}>「+ 旅行を追加」から最初の旅行を作成しましょう</p>
        </div>
      ) : (
        <div className={styles.tripGrid}>
          {trips.map((trip) => (
            <div key={trip.id} className={styles.tripCard} onClick={() => router.push(`/trips/${trip.id}`)}>
              <span className={styles.tripCardIcon}>{trip.cover}</span>
              <h2 className={styles.tripCardTitle}>{trip.title}</h2>
              <p className={styles.tripCardDestination}>📍 {trip.destination}</p>
              <div className={styles.tripCardMeta}>
                <span className={styles.tripCardDate}>{formatDateRange(trip.startDate, trip.endDate)}</span>
                <span className={styles.tripCardDays}>{calcDays(trip.startDate, trip.endDate)}日間</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>旅行を作成</h2>

            <p className={styles.iconPickerLabel}>アイコン</p>
            <div className={styles.iconGrid}>
              {COVER_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={`${styles.iconBtn} ${form.cover === emoji ? styles.iconBtnActive : ''}`}
                  onClick={() => setForm({ ...form, cover: emoji })}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>旅行タイトル</label>
              <input
                className={styles.formInput}
                placeholder="例: 京都・大阪の旅"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>目的地</label>
              <input
                className={styles.formInput}
                placeholder="例: 京都・大阪"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>出発日</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>帰宅日</label>
                <input
                  type="date"
                  className={styles.formInput}
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={closeModal}>キャンセル</button>
              <button className={styles.btnPrimary} onClick={handleCreate} disabled={!isFormValid}>
                旅行を作成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
