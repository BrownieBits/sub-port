import { addDays, addHours, addMonths, addYears, format } from 'date-fns';
import { ChartJSON } from '../types';

export function buildHourly(): ChartJSON {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const hours: ChartJSON = {};
  Array.from({ length: 24 }, (_, i) => {
    const dateString = format(addHours(midnight, i), 'h:m aaa');
    hours[dateString] = [];
  });
  return hours;
}
export function buildDaily(diffInDays: number, startDate: Date): ChartJSON {
  const days: ChartJSON = {};
  Array.from({ length: diffInDays }, (_, i) => {
    const dateString = format(addDays(startDate, i), 'LLL dd');
    days[dateString] = [];
  });
  return days;
}
export function buildMonthly(diffInMonths: number, startDate: Date): ChartJSON {
  const months: ChartJSON = {};
  Array.from({ length: diffInMonths }, (_, i) => {
    const dateString = format(addMonths(startDate, i), 'LLL');
    months[dateString] = [];
  });
  return months;
}
export function buildYearly(diffInYears: number, startDate: Date): ChartJSON {
  const years: ChartJSON = {};
  Array.from({ length: diffInYears }, (_, i) => {
    const dateString = format(addYears(startDate, i), 'yyyy');
    years[dateString] = [];
  });
  return years;
}
