import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Trip } from '../src/types/trip';
import { getTrips, addTrip } from '../src/lib/store';
import { site } from '../src/config/site';
import LandingPage from '../src/components/LandingPage';
import CreateTripModal from '../src/components/CreateTripModal';
import styles from '../styles/tripplan.module.css';

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

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type TripStatus = { label: string; kind: 'ongoing' | 'soon' | 'near' } | null;

function getTripStatus(startDate: string, endDate: string): TripStatus {
  const today = todayStr();
  if (today >= startDate && today <= endDate) return { label: '旅行中 ✈', kind: 'ongoing' };
  if (today < startDate) {
    const daysUntil = Math.round(
      (new Date(startDate + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86400000
    );
    if (daysUntil <= 7) return { label: `あと ${daysUntil} 日！`, kind: 'soon' };
    if (daysUntil <= 30) return { label: `あと ${daysUntil} 日`, kind: 'near' };
  }
  return null;
}

function getDaysUntilNext(trips: Trip[]): number | null {
  const today = todayStr();
  const upcoming = trips
    .filter((t) => t.startDate > today)
    .map((t) => Math.round((new Date(t.startDate + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86400000));
  if (upcoming.length === 0) return null;
  return Math.min(...upcoming);
}


const headMeta = (
  <Head>
    <title>{site.homeTitle}</title>
    <meta name="description" content={site.metaDescription} />
    <meta property="og:title" content={site.name} />
    <meta property="og:description" content={site.metaDescription} />
    <meta property="og:type" content="website" />
  </Head>
);

export default function HomePage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [presetDestination, setPresetDestination] = useState<string | undefined>();

  useEffect(() => {
    setTrips(getTrips());
    setInitialized(true);
  }, []);

  const openModal = (destination?: string) => {
    setPresetDestination(destination);
    setShowModal(true);
  };

  const handleCreate = async (input: { cover: string; title: string; destination: string; startDate: string; endDate: string; passwordHash?: string }) => {
    const trip = addTrip(input);
    setTrips(getTrips());
    setShowModal(false);
    router.push(`/trips/${trip.id}`);
  };

  if (!initialized) return null;

  // LP: トリップが 0 件のときのみ表示
  if (trips.length === 0) {
    return (
      <div className={styles.app}>
        <LandingPage onStart={openModal} />
        {showModal && <CreateTripModal onClose={() => setShowModal(false)} onCreate={handleCreate} initialDestination={presetDestination} />}
      </div>
    );
  }

  // トリップ一覧
  const daysUntilNext = getDaysUntilNext(trips);
  const summaryText = daysUntilNext !== null
    ? `旅行 ${trips.length}件 · 次の旅まであと ${daysUntilNext}日`
    : `旅行 ${trips.length}件`;

  return (
    <div className={styles.app}>
      {headMeta}
      <div className={styles.homeHeader}>
        <div>
          <button className={styles.homeLogoBtn} onClick={() => router.push('/lp')}>{site.name}</button>
          <p className={styles.homeSummary}>{summaryText}</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          + 旅行を追加
        </button>
      </div>

      <div className={styles.tripGrid}>
        {trips.map((trip) => {
          const status = getTripStatus(trip.startDate, trip.endDate);
          const spotCount = trip.days.flatMap((d) => d.spots).length;
          return (
            <div key={trip.id} className={styles.tripCard} onClick={() => router.push(`/trips/${trip.id}`)}>
              {status && (
                <span className={`${styles.tripStatusBadge} ${styles[`tripStatus_${status.kind}`]}`}>
                  {status.label}
                </span>
              )}
              <span className={styles.tripCardIcon}>{trip.cover}</span>
              <h2 className={styles.tripCardTitle}>{trip.title}</h2>
              <p className={styles.tripCardDestination}>📍 {trip.destination}</p>
              <div className={styles.tripCardMeta}>
                <span className={styles.tripCardDate}>{formatDateRange(trip.startDate, trip.endDate)}</span>
                <span className={styles.tripCardDays}>{calcDays(trip.startDate, trip.endDate)}日間</span>
                {spotCount > 0 && <span className={styles.tripCardSpots}>{spotCount}スポット</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <CreateTripModal onClose={() => setShowModal(false)} onCreate={handleCreate} initialDestination={presetDestination} />}
    </div>
  );
}
