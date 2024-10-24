import type { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
// import { openai } from '@ai-sdk/openai';
// import { anthropic } from '@ai-sdk/anthropic';
// import { generateText } from 'ai';

const summarizeThread = async ({ context, say, body, command, payload }: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  console.log('summarizeThread body', body);
  console.log('summarizeThread command', command);
  console.log('summarizeThread payload', payload);
  console.log('summarizeThread context', context);
  try {
    // const { text } = await generateText({
    //   model: openai('gpt-4o') || anthropic('claude-3-haiku-20240307'),
    //   prompt: `Summarize the following thread: ${message}`,
    // });

    // const summary = text || 'No summary found';
    const summary = 'No summary found';

    await say(`${summary}`);
  } catch (error) {
    console.error(error);
  }
};

export default summarizeThread;
