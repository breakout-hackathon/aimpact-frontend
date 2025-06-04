import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = await fetch("https://app.youform.com/widgets/widget.js");
  const script = await response.text();
  
  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  });
}
