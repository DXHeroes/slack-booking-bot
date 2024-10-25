import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from '@slack/bolt';
import moment from 'moment';
import { createBooking, fetchBooking } from '../../functions/db-service';
import { getAppHomeView } from '../events/app-home-opened';

const editParkingSpotNoteCallback = async ({
  ack,
  body,
  client,
  action,
  logger
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  await ack();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [date, spot] = (action as any).value.split('_');
  const userId = body.user.id;

  try {
    // Here you would typically interact with your database
    // For this example, we'll just log the booking
    console.log(`Editing note for parking spot ${spot} for user ${userId} on ${date}`);

    const booking = await fetchBooking(date, spot, userId);

    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: `update_parking_spot_note_${spot}`,
        private_metadata: `${date}_${spot}`,
        title: {
          type: 'plain_text',
          text: `Edit Note for #${spot}`,
        },
        blocks: [
          {
            type: 'input',
            label: {
              type: 'plain_text',
              text: 'Note',
            },
            block_id: 'note',
            element: {
              type: 'plain_text_input',
              action_id: 'note_text',
              placeholder: {
                type: 'plain_text',
                text: 'Write your note here...',
              },
              focus_on_load: true,
              initial_value: booking?.note || '',
              min_length: 4,
              max_length: 64,
              multiline: false,
            },
          },
        ],
        close: {
          type: 'plain_text',
          text: 'Cancel',
        },        
        submit: {
          type: 'plain_text',
          text: 'Update',
        },
      }
    });

    logger.info(result);
    logger.info(result.state)

    // console.log(`Booking parking spot ${spot} for user ${userId} on ${date}`);

    // const dateMoment = moment(date, 'YYYY-MM-DD');
    // await createBooking(dateMoment, spot, userId, note);

  } catch (error) {
    console.error(error);
    // Notify the user of the error
    await client.chat.postMessage({
      channel: userId,
      text: `There was an editing your note. Please try again. ${error}`
    });
  }
};

export default editParkingSpotNoteCallback;

