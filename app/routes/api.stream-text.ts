// // app/routes/api.chat.tsx
// import { json } from "@remix-run/node";
// import type { ActionFunctionArgs } from "@remix-run/node";
// import { streamText, type StreamingOptions } from "~/lib/.server/llm/stream-text";
// import type { Message } from "ai";
// import type { FileMap } from "~/lib/.server/llm/constants";
// import type { IProviderSetting } from "~/types/model";
// import { createScopedLogger } from "~/utils/logger";

// const logger = createScopedLogger("api.chat");

/*
 * export async function action({ request, context }: ActionFunctionArgs) {
 *   try {
 *     // Parse the request body
 *     const {
 *       messages,
 *       files,
 *       providerSettings,
 *       promptId,
 *       contextOptimization = false,
 *       contextFiles,
 *       summary,
 *       messageSliceId,
 *     } = await request.json<{
 *         messages: Omit<Message, "id">[];
 *         env?: Env;
 *         options?: StreamingOptions;
 *         files?: FileMap;
 *         providerSettings?: Record<string, IProviderSetting>;
 *         promptId?: string;
 *         contextOptimization?: boolean;
 *         contextFiles?: FileMap;
 *         summary?: string;
 *         messageSliceId?: number;
 *     }>();
 */

/*
 *     if (!messages || !Array.isArray(messages)) {
 *       return json({ error: "Valid messages array is required" }, { status: 400 });
 *     }
 */

/*
 *     logger.info("Processing chat request", {
 *       messageCount: messages.length,
 *       hasContextFiles: !!contextFiles,
 *       contextOptimization
 *     });
 */

/*
 *     // Get the streaming response from our custom streamText implementation
 *     const stream = await streamText({
 *       messages: messages as Omit<Message, "id">[],
 *       env: context.env as Env, // Pass environment from Remix context
 *       options: {
 *         temperature: 0.7,
 *         // supabaseConnection: {
 *           // isConnected: context.supabase?.isConnected || false,
 *           // hasSelectedProject: context.supabase?.hasSelectedProject || false,
 *           // credentials: context.supabase?.credentials
 *         // }
 *       },
 *       apiKeys: apiKeys as Record<string, string>,
 *       files: files as FileMap,
 *       providerSettings: providerSettings as Record<string, IProviderSetting>,
 *       promptId,
 *       contextOptimization,
 *       contextFiles: contextFiles as FileMap,
 *       summary,
 *       messageSliceId,
 *     });
 */

/*
 *     // Return the streaming response
 *     return stream;
 *   } catch (error) {
 *     logger.error("Error generating streaming response:", error);
 *     return json(
 *       {
 *         error: "An error occurred while processing your request",
 *         details: process.env.NODE_ENV === "development" ? String(error) : undefined
 *       },
 *       { status: 500 }
 *     );
 *   }
 * }
 */

// // Optionally handle GET requests with an explanation
// export async function loader() {
//   return json({
//     message: "This endpoint accepts POST requests with chat messages and configuration",
//   });
// }
