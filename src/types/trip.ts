export type SpotCategory = '観光' | 'グルメ' | '散策' | '体験' | '宿泊';

export interface Cost {
  label: string;
  amount: string;
}

export interface Spot {
  id: number;
  name: string;
  startTime: string;
  duration: number;
  category: SpotCategory;
  note: string;
  url: string;
  costs: Cost[];
}

export interface Day {
  date: string;
  spots: Spot[];
}

export interface Trip {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  cover: string;
  days: Day[];
  passwordHash?: string;
}
