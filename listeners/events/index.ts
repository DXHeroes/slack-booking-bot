import type { App } from '@slack/bolt';
import appHomeOpenedCallback from './app-home-opened';
import answerToMention from './answer-to-mention';

const register = (app: App) => {
  app.event('app_home_opened', appHomeOpenedCallback);
  app.event('app_mention', answerToMention);
};

export default { register };
