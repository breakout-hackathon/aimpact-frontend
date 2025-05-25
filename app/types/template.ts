import type { SaveFileMap } from '~/lib/stores/files';

export interface Template {
  name: string;
  label: string;
  description: string;
  githubRepo?: string;
  tags?: string[];
  icon?: string;
  files: SaveFileMap;
}
