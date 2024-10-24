import { Button, type KnownBlock, PlainTextElement } from '@slack/bolt';
import moment from 'moment';
import { DAYS_IN_RANGE } from './constants';

export const generateParkersModal = (): KnownBlock[] => {
  const today = moment();
  const blocks: KnownBlock[] = [];

  for (let i = 0; i < DAYS_IN_RANGE; i++) {
    const date = today.clone().add(i, 'days');
    const dayName = date.format('dddd');
    
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${dayName}*`
      }
    });

    // Here you would add logic to fetch and display booked spots
    // For now, we'll just add a placeholder text
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'No bookings yet.' // Replace this with actual booking data
      }
    });
  }

  return blocks;
};
