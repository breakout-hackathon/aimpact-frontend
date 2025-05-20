import * as fs from "fs";
import * as path from "path";

const folderPath = path.join(__dirname, "vite-template");
const ignorePaths = ["node_modules", ".git"];

interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
  isLocked?: boolean;
  lockedByFolder?: string; // Path of the folder that locked this file
}

interface Folder {
  type: 'folder';
  isLocked?: boolean;
  lockedByFolder?: string; // Path of the folder that locked this folder (for nested folders)
}

interface Snapshot {
  chatIndex: string;
  files: Record<string, File | Folder>;
  summary?: string;
}

async function walk(dirPath: string, result: Record<string, File | Folder>) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(folderPath, fullPath);

    if (ignorePaths.some(ignore => fullPath.includes(ignore))) {
      continue;
    }

    if (entry.isDirectory()) {
      result[`/home/project/${relativePath}`] = { type: 'folder' };
      await walk(fullPath, result);
    } else if (entry.isFile()) {
      const content = await fs.promises.readFile(fullPath, 'utf8');
      result[`/home/project/${relativePath}`] = {
        type: 'file',
        content,
        isBinary: false,
        isLocked: false,
      };
    }
  }
}

export async function generateSnapshot(): Promise<Snapshot> {
  const files: Record<string, File | Folder> = {};
  await walk(folderPath, files);

  return {
    chatIndex: 'null',
    files,
  };
}

async function main() {
  try {
    const snapshot = await generateSnapshot();
    const outputPath = path.join(__dirname, 'snapshot.json');
    const snapshotData = JSON.stringify(snapshot, null, 2);

    fs.writeFile(outputPath, snapshotData, 'utf-8', error => {
      if (error) {
        console.error('Error writing file', error);
        return;
      }
      console.log('File written successfully.');
    });
  } catch (err) {
    console.error('Error generating snapshot:', err);
  }
}

main();
