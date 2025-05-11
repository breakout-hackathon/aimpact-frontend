import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { default as Index } from './chat';

export async function loader(args: LoaderFunctionArgs) {
  return json({ id: args.params.id });
}

export default Index;
