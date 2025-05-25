import * as fs from "fs";
import * as path from "path";

const template = "vite-react-app"
const folderPath = path.join(__dirname, template);
const ignorePaths = ["node_modules", ".git", "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "dist", "build"];

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
  files: Record<string, File | Folder>;
  chatIndex?: string;
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

export async function generateSnapshot(): Promise<Record<string, Snapshot>> {
  const files: Record<string, File | Folder> = {};
  await walk(folderPath, files);

  return {
    [template]: {
      files,
    }
  };
}

async function main() {
  try {
    const snapshot = await generateSnapshot();
    const snapshotOutputPath = path.join(__dirname, 'snapshot.json');
    const promptOutputPath = path.join(__dirname, 'prompt.json');
    const snapshotData = JSON.stringify(snapshot, null, 2);

    fs.writeFile(snapshotOutputPath, snapshotData, 'utf-8', error => {
      if (error) {
        console.error('Error writing snapshot file', error);
        return;
      }
      console.log('Snapshot file written successfully.');
    });
    
    const filteredFiles = Object.entries(snapshot[template].files).filter(([file, value]) => value.type == "file");
    const assistantMessage = `
Bolt is initializing your project with the required files using the Vite.js Default template.
<boltArtifact id="imported-files" title="${'Create initial files'}" type="bundled">
${filteredFiles.map(
    ([file, value]) =>
`<boltAction type="file" filePath="${file}">
  ${(value as File).content}
</boltAction>`,
  )
  .join('\n')}
</boltArtifact>
`;

  const userMessage = `
---
template import is done, and you can now use the imported files,
edit only the files that need to be changed, and you can create new files as needed.
NO NOT EDIT/WRITE ANY FILES THAT ALREADY EXIST IN THE PROJECT AND DOES NOT NEED TO BE MODIFIED
---
Now that the Template is imported please continue with my original request

IMPORTANT: Dont Forget to install the dependencies before running the app by using \`npm install && npm run dev\`
`;
    const promptData = JSON.stringify({ [template]: { assistantMessage, userMessage } }, null, 2);

    fs.writeFile(promptOutputPath, promptData, 'utf-8', error => {
      if (error) {
        console.error('Error writing promptFile', error)
        return;
      }
      console.log("Prompt file written successfully.")
    })
  } catch (err) {
    console.error('Error generating snapshot:', err);
  }
}

main();
