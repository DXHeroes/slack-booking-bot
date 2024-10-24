import type { AllMiddlewareArgs, Button, SlackEventMiddlewareArgs } from '@slack/bolt';
import type { Moment } from 'moment';
import { buildFreeParkingSpotsUI } from '../../functions/build-free-parking-spots-ui';
import { buildMyParkingSpotsUI } from '../../functions/build-my-parking-spots-ui';
import { generateDateRange } from '../../functions/generate-date-range';
import { type ParkingSpots, generateParkingSpots } from '../../functions/generate-parking-spots';

const appHomeOpenedCallback = async ({
  client,
  event,
}: AllMiddlewareArgs & SlackEventMiddlewareArgs<'app_home_opened'>) => {
  // Ignore the `app_home_opened` event for anything but the Home tab
  if (event.tab !== 'home') return;

  try {
    await client.views.publish({
      user_id: event.user,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      view: await getAppHomeView(event.user) as any
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAppHomeView = async (userId: string) => {
  const dateRange = generateDateRange();

  const spotsForDate = await Promise.all(dateRange.map(async (date) => await generateParkingSpots(date, userId)));

  return {
    type: 'home',
    blocks: [
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            style: 'primary',
            text: {
              type: 'plain_text',
              text: 'Parkers :information_source:',
              emoji: true,
            },
            action_id: 'view_parking_reservations',
          },
        ],
      },
      ...dateRange.flatMap((date, index) => [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${date.format('dddd')}*`,
          },
        },
        ...getSpotBlocks(spotsForDate[index], date),
      ]),
    ],
  }
}

const getSpotBlocks = (spots: ParkingSpots, date: Moment) => {
  const blocks = [];

  if (spots.bookedSpots.length > 0) {
    blocks.push(...buildMyParkingSpotsUI(spots.bookedSpots, date));
  }

  if (spots.availableSpots.length === 0) {
    blocks.push({
      type: 'section',  
      text: {
        type: 'mrkdwn',
        text: 'No spots available',
      },
    });
  } else {
    blocks.push(buildFreeParkingSpotsUI(spots.availableSpots, date))
  }

  console.log("blocks.length", blocks.length)
  return blocks;
}

export default appHomeOpenedCallback;
