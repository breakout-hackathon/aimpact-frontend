import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { streamText } from '~/lib/.server/llm/stream-text';
import { stripIndents } from '~/utils/stripIndent';
import type { ProviderInfo } from '~/types/model';
import { createScopedLogger } from '~/utils/logger';
import { DEFAULT_MINI_PROVIDER } from '~/utils/constants';
import { parseCookies } from '~/lib/api/cookies';

const defaultApiKeys = {
  OpenAI: process.env.OPENAI_API_KEY as string,
};
const DEFAULT_MODEL = 'gpt-4.1-mini';

export async function action(args: ActionFunctionArgs) {
  return enhancerAction(args);
}

const logger = createScopedLogger('api.enhancher');

async function enhancerAction({ context, request }: ActionFunctionArgs) {
  const { message } = await request.json<{
    message: string;
  }>();

  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  const authToken = cookies.authToken;

  if (!authToken) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const userResponse = await fetch(`${import.meta.env.PUBLIC_BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  if (!userResponse.ok) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const user = (await userResponse.json()) as { id: string; messagesLeft: number };
  if (user.messagesLeft <= 0) {
    throw new Response('No messages left', { status: 402 });
  }

  const { name: providerName } = DEFAULT_MINI_PROVIDER as ProviderInfo;

  // validate 'model' and 'provider' fields
  const model = DEFAULT_MODEL;

  if (!providerName || typeof providerName !== 'string') {
    throw new Response('Invalid or missing provider', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  const apiKeys = defaultApiKeys;

  try {
    const result = await streamText({
      messages: [
        {
          role: 'user',
          content:
            `[Model: ${model}]\n\n[Provider: ${providerName}]\n\n` +
            stripIndents`
            You are a professional prompt engineer specializing in crafting precise, effective prompts.
            Your task is to enhance prompts by making them more specific, actionable, effective and Web3 interoperability, if relevant..

            Improve the user prompt that is wrapped in \`<original_prompt>\` tags.

            For valid prompts:
            - Make instructions explicit and unambiguous
            - Add relevant context and constraints
            - Remove redundant information
            - Maintain the core intent
            - Ensure the prompt is self-contained
            - Use professional language

            For invalid or unclear prompts:
            - Respond with clear, professional guidance
            - Keep responses concise and actionable
            - Maintain a helpful, constructive tone
            - Use a standard template for consistency
            - Try to come with an idea

            IMPORTANT: Your response must ONLY contain the enhanced prompt text.
            Do not include any explanations, metadata, or wrapper tags.
            Do not include backend, documentation, setup instructions in enchanced prompt.
            Do not add Backend, Docker to the prompt. Focus on the application and its frontend and maybe description of interaction with web3.

            <original_prompt>
              ${message}
            </original_prompt>
          `,
        },
      ],
      env: context.cloudflare?.env as any,
      apiKeys,
      providerSettings: {},
      options: {
        system:
          'You are a senior software principal architect, you should help the user analyse the user query and enrich it with the necessary context and constraints to make it more specific, actionable, and effective. You should also ensure that the prompt is self-contained and uses professional language. Your response should ONLY contain the enhanced prompt text. Do not include any explanations, metadata, or wrapper tags.',

        /*
         * onError: (event) => {
         *   throw new Response(null, {
         *     status: 500,
         *     statusText: 'Internal Server Error',
         *   });
         * }
         */
      },
    });

    // Handle streaming errors in a non-blocking way
    (async () => {
      try {
        for await (const part of result.fullStream) {
          if (part.type === 'error') {
            const error: any = part.error;
            logger.error('Streaming error:', error);
            break;
          }
        }
      } catch (error) {
        logger.error('Error processing stream:', error);
      }
    })();

    // Return the text stream directly since it's already text data
    return new Response(result.textStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error && error.message?.includes('API key')) {
      throw new Response('Invalid or missing API key', {
        status: 401,
        statusText: 'Unauthorized',
      });
    }

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}
