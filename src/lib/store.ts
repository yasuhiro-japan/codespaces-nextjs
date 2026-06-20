import type { Trip, Day } from '../types/trip';

let trips: Trip[] = [];
let nextTripId = 1;
let nextSpotId = 1;

export function getTrips(): Trip[] {
  return trips;
}

export function getTrip(id: number): Trip | undefined {
  return trips.find((t) => t.id === id);
}

export function addTrip(data: Omit<Trip, 'id' | 'days'>): Trip {
  const newTrip: Trip = { ...data, id: nextTripId++, days: generateDays(data.startDate, data.endDate) };
  trips = [...trips, newTrip];
  return newTrip;
}

export function updateTrip(trip: Trip): void {
  trips = trips.map((t) => (t.id === trip.id ? trip : t));
}

export function nextSpotId_get(): number {
  return nextSpotId++;
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
