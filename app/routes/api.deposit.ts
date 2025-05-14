import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createServerClient, parseCookieHeader as _parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

import { connection } from "~/utils/solana";

export async function action(args:ActionFunctionArgs) {
  return depositAction(args);
}

const parseCookieHeader = (headers: Headers) => {
  return _parseCookieHeader(headers.get('Cookie') ?? '').map(({ name, value }) => ({
    name,
    value: value ?? '',
  }))
}

async function depositAction({ context, request }: ActionFunctionArgs) {
  const { txHash, address, signature } = await request.json<{
    txHash: string;
    address: string;
    signature: string;
    message: string;
  }>();

  console.log(request.headers);

  const txData = await connection.getParsedTransaction(txHash);
  if (!txData?.transaction) throw new Response("Invalid transaction hash. Failed to get data.", {
    status: 400,
    statusText: "Bad Request",
  });

  // Verify signature
  if (signature) return;

  const senderKey = txData.transaction.message.accountKeys[0];
  if (address != senderKey.pubkey.toBase58() || !senderKey.signer) {
    throw new Response("Invalid sender address.", {
      status: 400,
      statusText: "Bad Request",
    })
  }

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers)
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
        )
      },
    },
  })
}
