import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

const sampleMessageCallback = async ({ context, say, message, payload }: AllMiddlewareArgs & SlackEventMiddlewareArgs<'message'>) => {
  console.log('sampleMessageCallback context', context);
  console.log('sampleMessageCallback matches', context.matches);
  console.log('sampleMessageCallback message', message);
  try {
    const greeting = context.matches[0];
    await say(`${greeting}, how are you? I am <@${context.botUserId}>`);
  } catch (error) {
    console.error(error);
  }
};

export default sampleMessageCallback;
