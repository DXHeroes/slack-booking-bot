import type { Moment } from 'moment';
import { redis } from '../db';

type Booking = {
  date: string;
  spot: string;
  userId: string;
  note?: string;
};

const formatDate = (date: Moment) => date.format('YYYY-MM-DD');

// get all bookings for a specific date and spot
export const fetchBookingsAtDate = async (date: Moment): Promise<Booking[]> => {

  console.log("fetching bookings for date", formatDate(date))
  const bookings: Booking[] = <string | undefined>await redis.get(`bookings:${formatDate(date)}`) || [];
  console.log("bookings", bookings)
  return bookings;
};

// create a new booking for a specific date and spot
export const createBooking = async (date: Moment, spot: string, userId: string, note?: string) => {
  const booking: Booking = { date: formatDate(date), spot, userId, note };
  
  // validate if a requested spot is still available
  const bookings = await fetchBookingsAtDate(date);

  const isBookedByAnotherUser = bookings.some(b => b.spot === spot && b.userId !== userId);
  const isBookedByUser = bookings.some(b => b.spot === spot && b.userId === userId);

  if (isBookedByAnotherUser) {
    throw new Error('Spot is not available');
  }

  let newBookings = bookings;
  if (isBookedByUser) {
    // remove booking
    newBookings = bookings.filter(b => b.spot !== spot);
  } else {
    // create booking
    newBookings = [...bookings, booking];
  }
  await redis.create(`bookings:${formatDate(date)}`, JSON.stringify(newBookings));

  console.log("Booking created successfully");
  
  return newBookings;
};
