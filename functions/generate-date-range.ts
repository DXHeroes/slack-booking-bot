import moment from 'moment';
import { DAYS_IN_RANGE } from './constants';

export const generateDateRange = (): moment.Moment[] => {
  const dateRange: moment.Moment[] = [];
  for (let i = 0; i < DAYS_IN_RANGE; i++) {
    dateRange.push(moment().add(i, 'days'));
  }
  return dateRange;
};