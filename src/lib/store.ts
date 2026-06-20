import type { Trip, Day } from '../types/trip';

const STORAGE_KEY = 'tripplan_trips';

const sampleTrips: Trip[] = [
  {
    id: 1,
    title: '京都・奈良の週末',
    destination: '京都・奈良',
    startDate: '2025-10-18',
    endDate: '2025-10-20',
    cover: '🏯',
    days: [
      {
        date: '2025-10-18',
        spots: [
          {
            id: 1,
            name: '清水寺',
            startTime: '09:00',
            duration: 90,
            category: '観光',
            note: '舞台からの眺めが最高。早めに行く。',
            url: 'https://www.kiyomizudera.or.jp/',
            costs: [{ label: '拝観料', amount: '400' }],
          },
          {
            id: 2,
            name: '祇園散策',
            startTime: '11:00',
            duration: 60,
            category: '散策',
            note: '雰囲気のある路地を歩く',
            url: 'https://www.gion.or.jp/',
            costs: [{ label: 'おやつ', amount: '800' }],
          },
        ],
      },
      {
        date: '2025-10-19',
        spots: [
          {
            id: 3,
            name: '東大寺',
            startTime: '10:00',
            duration: 120,
            category: '観光',
            note: '大仏殿と二月堂を見学',
            url: 'https://www.todaiji.or.jp/',
            costs: [{ label: '拝観料', amount: '500' }],
          },
          {
            id: 4,
            name: '奈良公園で鹿せんべい',
            startTime: '12:30',
            duration: 45,
            category: '体験',
            note: 'のんびり散策',
            url: 'https://www.pref.nara.jp/park/index.html',
            costs: [{ label: 'せんべい', amount: '200' }],
          },
        ],
      },
      {
        date: '2025-10-20',
        spots: [
          {
            id: 5,
            name: '嵐山竹林',
            startTime: '09:30',
            duration: 60,
            category: '散策',
            note: '朝の静けさを楽しむ',
            url: 'https://www.japan-guide.com/e/e3912.html',
            costs: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: '東京グルメ旅',
    destination: '東京',
    startDate: '2025-12-05',
    endDate: '2025-12-06',
    cover: '🍜',
    days: [
      {
        date: '2025-12-05',
        spots: [
          {
            id: 6,
            name: '築地市場',
            startTime: '08:30',
            duration: 90,
            category: 'グルメ',
            note: '朝ごはんに寿司を食べる',
            url: 'https://www.tsukiji.or.jp/',
            costs: [{ label: '朝食', amount: '2500' }],
          },
          {
            id: 7,
            name: '浅草寺',
            startTime: '11:00',
            duration: 60,
            category: '観光',
            note: '仲見世の散策',
            url: 'https://www.senso-ji.jp/',
            costs: [{ label: 'おみくじ', amount: '100' }],
          },
        ],
      },
      {
        date: '2025-12-06',
        spots: [
          {
            id: 8,
            name: '渋谷スクランブル交差点',
            startTime: '10:00',
            duration: 30,
            category: '散策',
            note: '人混みを体験',
            url: 'https://www.shibuya109.jp/',
            costs: [],
          },
          {
            id: 9,
            name: '原宿カフェ',
            startTime: '11:00',
            duration: 90,
            category: 'グルメ',
            note: '話題のパンケーキを食べる',
            url: 'https://www.haruhari.jp/',
            costs: [{ label: 'ランチ', amount: '1800' }],
          },
        ],
      },
    ],
  },
];

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function loadFromStorage(): Trip[] {
  if (!isClient()) return sampleTrips;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Trip[];
  } catch {
    // corrupted data — fall through to seed
  }
  // First visit: seed with sample trips
  saveToStorage(sampleTrips);
  return sampleTrips;
}

function saveToStorage(data: Trip[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage quota exceeded — ignore
  }
}

function maxId(data: Trip[]): number {
  return data
    .flatMap((trip) => trip.days.flatMap((day) => day.spots.map((spot) => spot.id)))
    .reduce((max, id) => Math.max(max, id), 0);
}

// Lazily initialized on first access
let _trips: Trip[] | null = null;
let _nextTripId: number | null = null;
let _nextSpotId: number | null = null;

function ensureLoaded(): void {
  if (_trips !== null) return;
  _trips = loadFromStorage();
  _nextTripId = _trips.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  _nextSpotId = maxId(_trips) + 1;
}

export function getTrips(): Trip[] {
  ensureLoaded();
  return _trips!;
}

export function getTrip(id: number): Trip | undefined {
  ensureLoaded();
  return _trips!.find((t) => t.id === id);
}

export function addTrip(data: Omit<Trip, 'id' | 'days'>): Trip {
  ensureLoaded();
  const newTrip: Trip = { ...data, id: _nextTripId!++, days: generateDays(data.startDate, data.endDate) };
  _trips = [..._trips!, newTrip];
  saveToStorage(_trips);
  return newTrip;
}

export function updateTrip(trip: Trip): void {
  ensureLoaded();
  _trips = _trips!.map((t) => (t.id === trip.id ? trip : t));
  saveToStorage(_trips);
}

export function deleteTrip(id: number): void {
  ensureLoaded();
  _trips = _trips!.filter((t) => t.id !== id);
  saveToStorage(_trips);
}

export function nextSpotId_get(): number {
  ensureLoaded();
  return _nextSpotId!++;
}

function generateDays(startDate: string, endDate: string): Day[] {
  const days: Day[] = [];
  const current = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  while (current <= end) {
    days.push({ date: current.toISOString().slice(0, 10), spots: [] });
    current.setDate(current.getDate() + 1);
  }
  return days;
}
