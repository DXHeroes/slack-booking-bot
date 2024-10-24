import type { App } from '@slack/bolt';
import bookParkingSpotCallback from './book-parking-spot';
import sampleActionCallback from './sample-action';
import viewParkingReservationsCallback from './view-parking-reservations';

const register = (app: App) => {
  app.action('sample_action_id', sampleActionCallback);
  app.action('view_parking_reservations', viewParkingReservationsCallback);
  app.action(/^book_parking_spot_/, bookParkingSpotCallback);
};

export default { register };
