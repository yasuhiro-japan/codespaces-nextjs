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

  useEffect(() => {
    setTrips(getTrips());
    setInitialized(true);
  }, []);

  const openModal = () => setShowModal(true);

  const handleCreate = (input: { cover: string; title: string; destination: string; startDate: string; endDate: string }) => {
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
        {showModal && <CreateTripModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      </div>
    );
  }

  // トリップ一覧
  return (
    <div className={styles.app}>
      {headMeta}
      <div className={styles.homeHeader}>
        <button className={styles.homeLogoBtn} onClick={() => router.push('/lp')}>{site.name}</button>
        <button className={styles.addBtn} onClick={openModal}>
          + 旅行を追加
        </button>
      </div>

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

      {showModal && <CreateTripModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}
