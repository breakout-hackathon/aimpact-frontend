import { createCookieSessionStorage, type ActionFunctionArgs } from "@remix-run/node";
import { PublicKey,  } from "@solana/web3.js";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: ['super-secret-key'],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

export async function action({ request }: ActionFunctionArgs) {
  const { message, signature, address } = await request.json<{
    message: string;
    signature: string;
    address: string;
  }>();

  try {
    const publicKey = new PublicKey(address);
    const isVerified = nacl.sign.detached.verify();
    console.log(message, signature, address);
  } catch {}
}
  