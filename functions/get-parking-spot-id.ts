
import type { Moment } from 'moment';

export const getParkingSpotId = (date: Moment, number: number) => {
  return `${date.format('YYYY-MM-DD')}-${number}`;
};