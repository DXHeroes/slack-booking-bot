import type { App } from '@slack/bolt';
import sampleCommandCallback from './sample-command';
import summarizeThread from './summarize-thread';

const register = (app: App) => {
  app.command('/sample-command', sampleCommandCallback);
  app.command('/summarize', summarizeThread);
};

export default { register };
