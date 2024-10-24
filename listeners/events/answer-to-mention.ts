import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

const answerToMention = async ({
  event, context, client, say
}: AllMiddlewareArgs & SlackEventMiddlewareArgs<'app_mention'>) => {
  console.log('answerToMention event', event);
  console.log('answerToMention context', context);

  if (!event.text.startsWith(`<@${context.botUserId}> summarize`) && !event.text.startsWith(`<@${context.botUserId}> summarize thread`) && !event.text.startsWith(`<@${context.botUserId}> summ`)) {
    console.log('Not a summarize command');
    return;
  }

  let model = openai('gpt-4o');
  
  try {
    if (event.text.includes('anthropic') || event.text.includes('claude')) {
      console.log('Using Anthropic model');
      model = model
    } else if (event.text.includes('openai') || event.text.includes('gpt')) {
      console.log('Using OpenAI model');
      model = openai('gpt-4o');
    }

    // get all messages in the thread
    const allThreadMessages = (await client.conversations
      .replies({ channel: event.channel, ts: event.thread_ts! })).messages!

    // get all message user names
    const userIdWithNames = await Promise.all(allThreadMessages
      // only unique users
      .filter((m, i, self) => self.findIndex(t => t.user === m.user) === i)
      // map the user ids to their real names
      .map(async (m) => {
        return {
          id: m.user,
          real_name: (m.user ? (await client.users.info({user: m.user})).user?.real_name : "bot")
        }
      }))

    const composedMessages = allThreadMessages.map((m, i) => `${userIdWithNames[i]?.real_name || "bot"}: ${m.text}`)

    // remove last message becuase it's this request for summary
    // composedMessages.pop()

    console.log('composedMessages', composedMessages);
    
    const { text } = await generateText({
      model,
      system: `
        You are a helpful assistant that summarizes Slack message threads.
        Summarize the Slack messages you are given to learn more about the topic and the context evolving from the beginning to the end.
        Answer in the same language as the main language of the conversation and be concise about it.
        If you cannot determine the language, answer in English.
        The summary should be precise and contain all the key points of the thread with user names.
        The first message is always the main message that started the thread.
        Ignore all bot messages except of the main message.
      `,
      // prompt: `
      //   The main message is ${composedMessages[0]}\n\n
      //   The thread is the following: ${composedMessages.slice(1)}\n
      // `,
      messages: composedMessages.map(m => ({ role: 'user', content: m }))
    });

    const summary = text || 'No summary found';
    // const summary = 'No summary found';

    if (event.thread_ts) {
      await say({ thread_ts: event.thread_ts, text: summary });
    } else {
      await say(`${summary}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export default answerToMention;