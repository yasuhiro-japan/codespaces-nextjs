import type { Spot } from '../types/trip';

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function calcEndTime(spot: Spot): string {
  return addMinutes(spot.startTime, spot.duration);
}

export function recalcTimes(spots: Spot[]): Spot[] {
  if (spots.length === 0) return [];
  const result = [...spots];
  for (let i = 1; i < result.length; i++) {
    result[i] = {
      ...result[i],
      startTime: addMinutes(result[i - 1].startTime, result[i - 1].duration),
    };
  }
  return result;
}
