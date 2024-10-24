import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from '@slack/bolt';
import moment from 'moment';
import { createBooking } from '../../functions/db-service';
import { getAppHomeView } from '../events/app-home-opened';

const bookParkingSpotCallback = async ({
  ack,
  body,
  client,
  action
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [date, spot] = (action as any).value.split('_');
  const userId = body.user.id;

  try {
    // Here you would typically interact with your database
    // For this example, we'll just log the booking
    console.log(`Booking parking spot ${spot} for user ${userId} on ${date}`);

    const dateMoment = moment(date, 'YYYY-MM-DD');
    await createBooking(dateMoment, spot, userId);

    // update app home
    await client.views.publish({
      user_id: userId,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      view: await getAppHomeView(userId) as any
    });

    await ack();
} catch (error) {
    console.error(error);
    // Notify the user of the error
    await client.chat.postMessage({
      channel: userId,
      text: `There was an error booking your parking spot. Please try again. ${error}`
    });
  }
};

export default bookParkingSpotCallback;

