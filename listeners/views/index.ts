import type { App } from '@slack/bolt';
import updateParkingSpotNoteCallback from '../actions/update-parking-spot-note';
import sampleViewCallback from './sample-view';

const register = (app: App) => {
  app.view('sample_view_id', sampleViewCallback);
  app.view(/^update_parking_spot_note_/, updateParkingSpotNoteCallback);
  // app.view(/^update_parking_spot_note_/, (a) => new Promise((resolve) => {
  //   a.logger.info(a.payload);
  //   resolve();
  //   })
  // );
};

export default { register };
