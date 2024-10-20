import { Timestamp } from 'firebase/firestore';

export type CitiesReached = {
  [key: string]: string[];
};
export type CitiesReachedData = {
  city: string;
  count: number;
};
export type ChartJSON = {
  [key: string]: string[];
};
export type ChartData = {
  date: string;
  data: number;
};
export type Analytic = {
  city: string;
  country: string;
  ip: string;
  options?: string[];
  product_id?: string;
  quantity?: number;
  store_id: string;
  region: string;
  type: string;
  user_id?: string;
  created_at: Timestamp;
  revenue?: string;
};
