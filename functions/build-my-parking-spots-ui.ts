import type { ActionsBlock, Button } from '@slack/bolt';
import type moment from 'moment';

export const buildMyParkingSpotsUI = (spots: string[], date: moment.Moment): ActionsBlock[] => {
  return spots.map((spot) => {
    return {
      type: 'actions',
      elements: [ 
        {
          type: 'button',
          text: {
          type: 'plain_text',
          text: spot.toString(),
          emoji: true,
        },
        value: `$date.format('YYYY-MM-DD')_${spot}`,
        action_id: `book_parking_spot_${spot}`,
          style: 'danger',
        },
        {
          type: 'button',
            text: {
              type: 'plain_text',
              text: ':memo: Add note',
              emoji: true,
            },
            value: `$date.format('YYYY-MM-DD')_${spot}`,
            action_id: `add_note_parking_spot_${spot}`,
        },
      ],
    };
  });

  // return {
  //   type: 'actions',
  //   elements: spots.flatMap((spot) => {
  //     return [
  //       {
  //         type: 'button',
  //         text: {
  //           type: 'plain_text',
  //           text: spot.toString(),
  //           emoji: true,
  //         },
  //         value: `$date.format('YYYY-MM-DD')_$spot`,
  //         action_id: `book_parking_spot_$spot`,
  //         style: 'danger',
  //       },
  //       {
  //         type: 'button',
  //         text: {
  //           type: 'plain_text',
  //           text: ':memo: Add note',
  //           emoji: true,
  //         },
  //         value: `$date.format('YYYY-MM-DD')_$spot`,
  //         action_id: `add_note_parking_spot_$spot`,
  //       },
  //     ];
  //   }),
  // };
};
