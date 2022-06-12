import { commandController } from './commandController.js';
import { readLine } from './readline.js';
import os from 'os';
import { terminalLogger } from './terminalLogger.js';

class FileManager {
  constructor(readLine, commandController) {
    this.userHomeDir = os.homedir();
    this.readLine = readLine;
    this.commandController = commandController;
  }

  start() {
    try {
      this.commandController.readLine(`cd ${this.userHomeDir}`);
      terminalLogger.welcome();
      this.onEventLine();
      this.onEventEnd();
    } catch (err) {
      terminalLogger.showErr(err);
    }
  }

  onEventLine() {
    this.readLine.on('line', async (line) => {
      if (line === '.exit') {
        this.readLine.close();
      } else {
        await this.commandController.readLine(line);
        terminalLogger.showPath();
      }
    });
  }

  onEventEnd() {
    this.readLine.on('close', () => {
      terminalLogger.finish();
    });
  }
}

export const fileManager = new FileManager(readLine, commandController);

fileManager.start();
