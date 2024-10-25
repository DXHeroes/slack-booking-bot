import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';
import moment from 'moment';
import { updateBooking } from '../../functions/db-service';
import { getAppHomeView } from '../events/app-home-opened';

const updateParkingSpotNoteCallback= async ({ ack, view, body, client, logger }: AllMiddlewareArgs & SlackViewMiddlewareArgs) => {
  await ack();

  const [ date, spot ] = view.private_metadata.split('_');
  const note = view.state.values.note.note_text.value;

  const userId = body.user.id;

  try {
    // Here you would typically interact with your database
    // For this example, we'll just log the booking
    console.log(`Updating note to "${note}" for parking spot ${spot} for user ${userId} on ${date}`);

    const dateMoment = moment(date, 'YYYY-MM-DD');
    await updateBooking(dateMoment, spot, userId, note);

    // update app home
    await client.views.publish({
      user_id: userId,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      view: await getAppHomeView(userId) as any
    });

  } catch (error) {
    console.error(error);
    // Notify the user of the error
    await client.chat.postMessage({
      channel: userId,
      text: `There was an error updating your parking spot note. Please try again. ${error}`
    });
  }
};

export default updateParkingSpotNoteCallback;

