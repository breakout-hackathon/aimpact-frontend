import { logger } from "~/utils/logger";
import { TerminalStore } from "../stores/terminal";
import { path as nodePath } from '~/utils/path';;
import type { WebContainer } from "@webcontainer/api";
import type { BoltShell } from "~/utils/shell";


export class DeployService {
  #webcontainer: Promise<WebContainer>;
  #shellTerminal: () => BoltShell;

  constructor(
    webcontainerPromise: Promise<WebContainer>,
    getShellTerminal: () => BoltShell,
  ) {
    this.#webcontainer = webcontainerPromise;
    this.#shellTerminal = getShellTerminal;
  }

  async runDeployScript() {
    const terminalStore = new TerminalStore(this.#webcontainer);

    const webcontainer = await this.#webcontainer;

    // Create a new terminal specifically for the build
    const buildProcess = await webcontainer.spawn('npm', ['run', 'build']);

    let output = '';
    buildProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
        },
      }),
    );

    const exitCode = await buildProcess.exit;

    if (exitCode !== 0) {
      // Trigger build failed alert
      throw new Error('Build Failed' + "\n" + output || 'No Output Available');
    }

    // Trigger build success alert
    // ...

    // Check for common build directories
    const commonBuildDirs = ['dist'];

    let buildDir = '';

    // Try to find the first existing build directory
    for (const dir of commonBuildDirs) {
      const dirPath = nodePath.join(webcontainer.workdir, dir);

      try {
        await webcontainer.fs.readdir(dirPath);
        buildDir = dirPath;
        logger.debug(`Found build directory: ${buildDir}`);
        break;
      } catch (error) {
        // Directory doesn't exist, try the next one
        logger.debug(`Build directory ${dir} not found, trying next option. ${error}`);
      }
    }

    // If no build directory was found, use the default (dist)
    if (!buildDir) {
      buildDir = nodePath.join(webcontainer.workdir, 'dist');
      logger.debug(`No build directory found, defaulting to: ${buildDir}`);
    }

    return {
      path: buildDir,
      exitCode,
      output,
    };
  }
}