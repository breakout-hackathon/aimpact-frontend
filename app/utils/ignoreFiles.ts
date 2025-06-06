import ignore from "ignore";
import type { FileMap } from "~/lib/stores/files";

const IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  '.github/**',
  '.vscode/**',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '.cache/**',
  '.idea/**',
  '**/*.log',
  '**/.DS_Store',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',
  '**/*lock.json',
  '**/*lock.yaml',
];

const defaultIgnore = ignore().add(IGNORE_PATTERNS);

export const filterIgnoreFiles = (files: FileMap) => {
  const filteredFiles = Object.keys(files).filter(key => {
    if (defaultIgnore.ignores(key)) return false;
    return true;
  });

  return filteredFiles;
}
