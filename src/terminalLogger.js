import { getUserName } from './utils.js';
import { cwd } from 'process';
import { readLine } from './readline.js';

class TerminalLogger {
  constructor(readLine) {
    this.userName = getUserName(process.argv);
    this.readLine = readLine;
  }

  welcome() {
    console.log(`Welcome to the File Manager, ${this.userName}!`);
    this.showPath();
  }

  finish() {
    console.log(`Thank you for using File Manager, ${this.userName}!`);
    this.readLine.close();
  }

  showPath() {
    console.log(`You are currently in: ${cwd()}`);
  }

  operationFailed() {
    console.log('Operation failed');
  }

  invalidInput() {
    console.log('Invalid input');
  }

  showErr(err) {
    console.error(err);
  }

  newFileCreated(fileName) {
    console.log(`A new file named ${fileName} has been created`);
  }

  fileNameChanged() {
    console.log('file name has been changed');
  }

  copyingCompleted() {
    console.log('Copying completed');
  }

  movingCompleted() {
    console.log('The file has moved');
  }

  removeCompleted() {
    console.log('The file has been deleted');
  }

  giveExtName() {
    console.log('You must specify the filename and extension');
  }
}

export const terminalLogger = new TerminalLogger(readLine);
