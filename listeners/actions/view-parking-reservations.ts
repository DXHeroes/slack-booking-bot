import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from '@slack/bolt';
import { fetchBookingsAtDate } from '../../functions/db-service';
import { generateDateRange } from '../../functions/generate-date-range';

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
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: bookedSpotsForDate[index].length <= 0 ? 'No bookings yet' : bookedSpotsForDate[index].map(s => `${s.spot} > <@${s.userId}>`).sort((a, b) => a.split('>')[0].localeCompare(b.split('>')[0])).join('\n')
              }
            }
          ];
        })

      }
    });
  } catch (error) {
    console.error(error);
  }
};

export default viewParkingReservationsCallback;

