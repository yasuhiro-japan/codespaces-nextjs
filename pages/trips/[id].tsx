import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Trip, Spot, Cost, SpotCategory } from '../../src/types/trip';
import { getTrip, updateTrip, nextSpotId_get } from '../../src/lib/store';
import { recalcTimes, calcEndTime } from '../../src/lib/recalcTimes';
import styles from '../../styles/tripplan.module.css';

const CATEGORIES: SpotCategory[] = ['観光', 'グルメ', '散策', '体験', '宿泊'];
const DURATIONS = [30, 60, 90, 120, 150, 180, 240, 300];
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

// ========================
// SpotAddForm
// ========================
interface SpotAddFormProps {
  isFirst: boolean;
  onAdd: (spot: Omit<Spot, 'id'>) => void;
  onCancel: () => void;
}

function SpotAddForm({ isFirst, onAdd, onCancel }: SpotAddFormProps) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState<SpotCategory>('観光');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [costs, setCosts] = useState<Cost[]>([]);

  const addCost = () => {
    if (costs.length < 3) setCosts([...costs, { label: '', amount: '' }]);
  };

  const updateCost = (i: number, field: keyof Cost, value: string) => {
    setCosts(costs.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  const removeCost = (i: number) => {
    setCosts(costs.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), startTime, duration, category, url, note, costs });
  };

  return (
    <div className={styles.addSpotForm}>
      <p className={styles.addSpotFormTitle}>スポットを追加</p>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>スポット名 *</label>
        <input
          className={styles.formInput}
          placeholder="例: 金閣寺"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className={styles.formRow}>
        {isFirst && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>開始時刻</label>
            <input
              type="time"
              className={styles.formInput}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        )}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>所要時間</label>
          <select
            className={styles.formSelect}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{formatDuration(d)}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>カテゴリ</label>
          <select
            className={styles.formSelect}
            value={category}
            onChange={(e) => setCategory(e.target.value as SpotCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>URL</label>
        <input
          className={styles.formInput}
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>費用（最大3件）</label>
        <div className={styles.costRows}>
          {costs.map((c, i) => (
            <div key={i} className={styles.costRow}>
              <input
                className={styles.formInput}
                placeholder="項目名（例: 入場料）"
                value={c.label}
                onChange={(e) => updateCost(i, 'label', e.target.value)}
              />
              <input
                className={styles.formInput}
                placeholder="金額（円）"
                inputMode="numeric"
                value={c.amount}
                onChange={(e) => updateCost(i, 'amount', e.target.value.replace(/[^\d]/g, ''))}
                style={{ maxWidth: 110 }}
              />
              <button className={styles.costDeleteBtn} onClick={() => removeCost(i)}>×</button>
            </div>
          ))}
        </div>
        {costs.length < 3 && (
          <button className={styles.addCostBtn} onClick={addCost}>+ 費用を追加</button>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>メモ</label>
        <textarea
          className={styles.formTextarea}
          placeholder="メモを入力..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onCancel}>キャンセル</button>
        <button className={styles.btnPrimary} onClick={handleSubmit} disabled={!name.trim()}>
          追加する
        </button>
      </div>
    </div>
  );
}

// ========================
// SpotDetailModal
// ========================
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

// ========================
// ShareModal
// ========================
interface ShareModalProps {
  tripId: number;
  onClose: () => void;
}

function ShareModal({ tripId, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${origin}/share/${tripId}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>旅行プランを共有</h2>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 4px' }}>
          以下のURLを共有してください
        </p>
        <div className={styles.shareUrlBox}>
          <span className={styles.shareUrl}>{url}</span>
          <button className={`${styles.copyBtn} ${copied ? styles.copyDone : ''}`} onClick={copy}>
            {copied ? 'コピー済み ✓' : 'コピー'}
          </button>
        </div>
        <button className={styles.modalCloseBtn} onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

// ========================
// TripDetailPage
// ========================
export default function TripDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [activeView, setActiveView] = useState<'schedule' | 'map'>('schedule');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [showShare, setShowShare] = useState(false);

  // D&D state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const t = getTrip(Number(id));
    if (!t) { router.replace('/'); return; }
    setTrip(t);
  }, [id]);

  if (!trip) return null;

  const day = trip.days[activeDayIdx];
  const spots = day.spots;

  const saveSpots = (newSpots: Spot[]) => {
    const recalced = recalcTimes(newSpots);
    const updatedDays = trip.days.map((d, i) => i === activeDayIdx ? { ...d, spots: recalced } : d);
    const updatedTrip = { ...trip, days: updatedDays };
    updateTrip(updatedTrip);
    setTrip({ ...updatedTrip });
  };

  const handleAddSpot = (spotData: Omit<Spot, 'id'>) => {
    const newSpot: Spot = { ...spotData, id: nextSpotId_get() };
    saveSpots([...spots, newSpot]);
    setShowAddForm(false);
  };

  const handleDeleteSpot = (e: React.MouseEvent, spotId: number) => {
    e.stopPropagation();
    saveSpots(spots.filter((s) => s.id !== spotId));
  };

  // Drag & Drop
  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === dropIndex) { setDragOverIndex(null); return; }
    const reordered = [...spots];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(dropIndex, 0, moved);
    saveSpots(reordered);
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const totalDays = calcTotalDays(trip.startDate, trip.endDate);

  return (
    <div className={styles.app}>
      <Head>
        <title>{trip.title} — TripPlan</title>
        <meta name="description" content={`${trip.destination} の旅行プラン`} />
      </Head>

      {/* Back */}
      <div style={{ padding: '20px 32px 0' }}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          ← 旅行一覧
        </button>
      </div>

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
        <button className={styles.shareBtn} onClick={() => setShowShare(true)}>
          共有
        </button>
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
                onClick={() => { setActiveDayIdx(i); setShowAddForm(false); }}
              >
                ▶ {i + 1}日目・{wd}（{formatDate(d.date)}）
              </button>
            );
          })}
        </div>
      </div>

      {/* View tabs */}
      <div className={styles.viewTabsWrapper}>
        <div className={styles.viewTabs}>
          <button
            className={`${styles.viewTab} ${activeView === 'schedule' ? styles.viewTabActive : ''}`}
            onClick={() => setActiveView('schedule')}
          >
            スケジュール
          </button>
          <button
            className={`${styles.viewTab} ${activeView === 'map' ? styles.viewTabActive : ''}`}
            onClick={() => setActiveView('map')}
          >
            地図
          </button>
        </div>
      </div>

      {/* Schedule view */}
      {activeView === 'schedule' && (
        <div className={styles.scheduleWrapper}>
          <div className={styles.spotList}>
            {spots.map((spot, i) => {
              const total = calcTotalCost(spot.costs);
              return (
                <div
                  key={spot.id}
                  className={[
                    styles.spotRow,
                    dragIndexRef.current === i ? styles.spotRowDragging : '',
                    dragOverIndex === i ? styles.spotRowDragOver : '',
                  ].join(' ')}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedSpot(spot)}
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
                  <button
                    className={styles.spotDeleteBtn}
                    onClick={(e) => handleDeleteSpot(e, spot.id)}
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {!showAddForm ? (
            <button className={styles.addSpotBtn} onClick={() => setShowAddForm(true)}>
              + スポットを追加
            </button>
          ) : (
            <SpotAddForm
              isFirst={spots.length === 0}
              onAdd={handleAddSpot}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </div>
      )}

      {/* Map view */}
      {activeView === 'map' && (
        <div className={styles.mapView}>
          <p className={styles.mapDestination}>📍 {trip.destination}</p>
          {spots.length === 0 ? (
            <p style={{ color: '#555', fontSize: 14 }}>スポットがまだ登録されていません</p>
          ) : (
            spots.map((spot) => (
              <div key={spot.id} className={styles.mapSpotItem}>
                <span className={styles.mapSpotTime}>{spot.startTime} 〜 {calcEndTime(spot)}</span>
                <span className={styles.mapSpotName}>{spot.name}</span>
                <span className={`${styles.categoryBadge} ${styles[`cat${spot.category}`]}`}>{spot.category}</span>
                <span className={styles.mapSpotDuration}>{formatDuration(spot.duration)}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Spot detail modal */}
      {selectedSpot && (
        <SpotDetailModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}

      {/* Share modal */}
      {showShare && (
        <ShareModal tripId={trip.id} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
