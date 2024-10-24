import type { Button } from '@slack/bolt';
import type moment from 'moment';
import { PARKING_SPOTS } from './constants';
import { fetchBookingsAtDate } from './db-service';

export const generateParkingSpots = async (date: moment.Moment, userId: string): Promise<Button[]> => {
  const spots = PARKING_SPOTS;

  // read bookings from db
  const bookings = await fetchBookingsAtDate(date);
  
  const allSpots = spots.map((spot) => {
    const booking = bookings?.find(b => b.date === date.format('YYYY-MM-DD') && b.spot === spot);
    const isBooked = !!booking;
    const isUserBooking = isBooked && booking.userId === userId;

    if (isBooked && !isUserBooking) {
      return null; // Hide spots booked by others
    }

    return {
      type: 'button',
      text: {
        type: 'plain_text',
        text: spot.toString(),
        emoji: true
      },
      value: `${date.format('YYYY-MM-DD')}_${spot}`,
      action_id: `book_parking_spot_${spot}`,
      style: isUserBooking ? 'danger' : undefined
    };
  }).filter(Boolean) as Button[]; // Filter out null values and cast to Button[]


  // sort by style (undefined last) and all that are not undefined then sort by spot name
  const bookedSpots = allSpots.filter(spot => spot?.style !== undefined);
  const availableSpots = allSpots.filter(spot => spot?.style === undefined);
  return [bookedSpots, availableSpots].flatMap(spots => spots.sort((a, b) => a.text.text.localeCompare(b.text.text)));
};
