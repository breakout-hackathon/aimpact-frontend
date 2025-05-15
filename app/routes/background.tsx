import { json, type MetaFunction } from '@remix-run/cloudflare';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [
    { title: 'AImpact' },
    { name: 'description', content: 'Talk with AImpact, an AI assistant for generating web3 projects' },
  ];
};

export const loader = () => json({});

export default function Background() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1 bg-transparent">
      <BackgroundRays />
    </div>
  );
}
