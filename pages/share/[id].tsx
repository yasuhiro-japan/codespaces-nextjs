import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Trip, Spot, Cost } from '../../src/types/trip';
import { getTrip } from '../../src/lib/store';
import { calcEndTime } from '../../src/lib/recalcTimes';
import styles from '../../styles/tripplan.module.css';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function formatDuration(min: number): string {
  if (min < 60) return `${min}分`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}時間` : `${h}時間${m}分`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function calcTotalDays(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  return Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
}

function calcTotalCost(costs: Cost[]): number | null {
  if (costs.length === 0) return null;
  const total = costs.reduce((sum, c) => {
    const n = parseFloat(c.amount);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  return total > 0 ? total : null;
}

interface SpotDetailModalProps {
  spot: Spot;
  onClose: () => void;
}

function SpotDetailModal({ spot, onClose }: SpotDetailModalProps) {
  const total = calcTotalCost(spot.costs);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.spotDetailModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.spotDetailHeader}>
          <div>
            <h2 className={styles.spotDetailName}>{spot.name}</h2>
            <div className={styles.spotBadges}>
              <span className={`${styles.categoryBadge} ${styles[`cat${spot.category}`]}`}>{spot.category}</span>
            </div>
          </div>
        </div>

        <div className={styles.spotDetailRow}>
          <span>🕐 {spot.startTime} 〜 {calcEndTime(spot)}</span>
          <span>（{formatDuration(spot.duration)}）</span>
        </div>

        {spot.url && (
          <div className={styles.spotDetailSection}>
            <p className={styles.spotDetailSectionLabel}>リンク</p>
            <a href={spot.url} target="_blank" rel="noopener noreferrer" className={styles.spotLink}>
              🔗 {spot.url}
            </a>
          </div>
        )}

        {spot.costs.length > 0 && (
          <div className={styles.spotDetailSection}>
            <p className={styles.spotDetailSectionLabel}>費用</p>
            <table className={styles.costTable}>
              <tbody>
                {spot.costs.map((c, i) => (
                  <tr key={i}>
                    <td>{c.label || '—'}</td>
                    <td>{c.amount ? `¥${Number(c.amount).toLocaleString()}` : '—'}</td>
                  </tr>
                ))}
                {total !== null && (
                  <tr className={styles.costTableTotal}>
                    <td>合計</td>
                    <td>¥{total.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.spotDetailSection}>
          <p className={styles.spotDetailSectionLabel}>メモ</p>
          <p className={styles.spotDetailNote}>{spot.note || 'なし'}</p>
        </div>

        <button className={styles.modalCloseBtn} onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    if (!id) return;
    const t = getTrip(Number(id));
    if (!t) {
      setNotFound(true);
      return;
    }
    setTrip(t);
  }, [id]);

  if (notFound) {
    return (
      <div className={styles.app}>
        <Head>
          <title>旅行プランが見つかりません — TripPlan</title>
        </Head>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <p className={styles.emptyText}>旅行プランが見つかりません</p>
          <p className={styles.emptySubText}>このURLは無効か、プランが削除されています</p>
          <button
            className={styles.btnPrimary}
            style={{ marginTop: 20 }}
            onClick={() => router.push('/')}
          >
            トップへ戻る
          </button>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const day = trip.days[activeDayIdx];
  const spots = day.spots;
  const totalDays = calcTotalDays(trip.startDate, trip.endDate);
  const pageTitle = `${trip.title} — TripPlan`;
  const pageDescription = `${trip.destination} ${formatDateFull(trip.startDate)}〜${formatDateFull(trip.endDate)}（${totalDays}日間）`;

  return (
    <div className={styles.app}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
      </Head>

      {/* Header */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <span className={styles.detailIcon}>{trip.cover}</span>
          <div className={styles.detailTitleGroup}>
            <h1 className={styles.detailTitle}>{trip.title}</h1>
            <span className={styles.detailMeta}>
              📍 {trip.destination}　{totalDays}日間
            </span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#888', padding: '0 16px' }}>閲覧モード</span>
      </div>

      {/* Day tabs */}
      <div className={styles.dayTabsWrapper}>
        <div className={styles.dayTabs}>
          {trip.days.map((d, i) => {
            const date = new Date(d.date + 'T00:00:00');
            const wd = WEEKDAYS[date.getDay()];
            return (
              <button
                key={d.date}
                className={`${styles.dayTab} ${i === activeDayIdx ? styles.dayTabActive : ''}`}
                onClick={() => setActiveDayIdx(i)}
              >
                ▶ {i + 1}日目・{wd}（{formatDate(d.date)}）
              </button>
            );
          })}
        </div>
      </div>

      {/* Spot list (read-only) */}
      <div className={styles.scheduleWrapper}>
        <div className={styles.spotList}>
          {spots.length === 0 ? (
            <p style={{ color: '#888', fontSize: 14, textAlign: 'center', padding: 32 }}>
              この日のスポットはまだ登録されていません
            </p>
          ) : (
            spots.map((spot) => {
              const total = calcTotalCost(spot.costs);
              return (
                <div
                  key={spot.id}
                  className={styles.spotRow}
                  onClick={() => setSelectedSpot(spot)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.spotTime}>
                    <span className={styles.spotTimeStart}>{spot.startTime}</span>
                    <span className={styles.spotTimeEnd}>{calcEndTime(spot)}</span>
                  </div>
                  <div className={styles.spotInfo}>
                    <div className={styles.spotNameRow}>
                      <span className={styles.spotName}>{spot.name}</span>
                    </div>
                    <div className={styles.spotBadges}>
                      <span className={`${styles.categoryBadge} ${styles[`cat${spot.category}`]}`}>{spot.category}</span>
                      <span className={styles.durationBadge}>{formatDuration(spot.duration)}</span>
                    </div>
                    {spot.note && <p className={styles.spotNote}>{spot.note}</p>}
                    <div className={styles.spotFooter}>
                      {total !== null && (
                        <span className={styles.spotCost}>¥{total.toLocaleString()}</span>
                      )}
                      {spot.url && (
                        <a
                          href={spot.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.spotLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🔗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Spot detail modal */}
      {selectedSpot && (
        <SpotDetailModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
}
