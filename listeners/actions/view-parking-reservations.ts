import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from '@slack/bolt';
import { fetchBookingsAtDate } from '../../functions/db-service';
import { generateDateRange } from '../../functions/generate-date-range';
import { generateParkingSpots } from '../../functions/generate-parking-spots';

const viewParkingReservationsCallback = async ({
  ack,
  body,
  client,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  await ack();

  const dateRange = generateDateRange();

  try {
    // Assuming fetchBookings is a function that fetches bookings from a database or storage
    // This function should be implemented elsewhere in the project
    const bookedSpotsForDate = await Promise.all(dateRange.map(async (date) => await fetchBookingsAtDate(date)));

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Parkers',
          emoji: true
        },
        close: {
          type: 'plain_text',
          text: 'Close',
          emoji: true
        },
        blocks: dateRange.flatMap((date, index) => {
          return [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: date.format('dddd'),
                emoji: true
              }
            },
            {
              type: 'actions',
              elements: bookedSpotsForDate[index] || []
            }
          ];
        }).filter(block => Array.isArray(block) && block.length > 0) // Remove empty days
    }
    });
  } catch (error) {
    console.error(error);
  }
};

export default viewParkingReservationsCallback;
function fetchBookings() {
    throw new Error('Function not implemented.');
}

