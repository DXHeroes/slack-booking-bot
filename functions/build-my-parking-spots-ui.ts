import type { ActionsBlock, Button } from '@slack/bolt';
import type moment from 'moment';

export const buildMyParkingSpotsUI = (spots: string[], date: moment.Moment): ActionsBlock => {
  return {
    type: 'actions',
    elements: spots.map((spot) => {
      return {
        type: 'button',
        text: {
          type: 'plain_text',
          text: spot.toString(),
          emoji: true,
        },
        value: `${date.format('YYYY-MM-DD')}_${spot}`,
        action_id: `book_parking_spot_${spot}`,
        style: 'danger',
      };
    }),
  };
};
