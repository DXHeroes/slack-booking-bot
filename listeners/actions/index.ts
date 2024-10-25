import type { App } from '@slack/bolt';
import bookParkingSpotCallback from './book-parking-spot';
import editParkingSpotNoteCallback from './edit-parking-spot-note';
import sampleActionCallback from './sample-action';
import updateParkingSpotNoteCallback from './update-parking-spot-note';
import viewParkingReservationsCallback from './view-parking-reservations';

const register = (app: App) => {
  app.action('sample_action_id', sampleActionCallback);
  app.action('view_parking_reservations', viewParkingReservationsCallback);
  app.action(/^book_parking_spot_/, bookParkingSpotCallback);
  app.action(/^edit_parking_spot_note_/, editParkingSpotNoteCallback);
  // app.action(/^update_parking_spot_note_/, updateParkingSpotNoteCallback);
};

export default { register };
