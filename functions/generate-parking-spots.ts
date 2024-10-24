import type moment from 'moment';
import { PARKING_SPOTS } from './constants';
import { fetchBookingsAtDate } from './db-service';
import { sortAlphabetically } from './sort-alphabetically';

export type ParkingSpots = {
  bookedSpots: string[];
  availableSpots: string[];
};

export const generateParkingSpots = async (date: moment.Moment, userId: string): Promise<ParkingSpots> => {
  const spots = PARKING_SPOTS;

  // read bookings from db
  const bookings = await fetchBookingsAtDate(date);

  const filterSpots = (type: 'myBooked' | 'available') => spots
    .filter((spot) => {
      const booking = bookings?.find((b) => b.date === date.format('YYYY-MM-DD') && b.spot === spot);
      const isBooked = !!booking;
      const isUserBooking = isBooked && booking.userId === userId;

      if (type === 'myBooked') {
        return isBooked && isUserBooking
      } 
      
      if (type === 'available') {
        return !isBooked
      } 
      
      throw new Error(`Invalid type in #generateParkingSpots: ${type}`);
    })

  return {
    bookedSpots: filterSpots("myBooked"),
    availableSpots: filterSpots("available")
  };
};
