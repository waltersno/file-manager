import { chdir, cwd } from 'process';
import { getAbsolutePath, getInputArr } from './utils.js';
import { __dirname } from './variables.js';
import fs from 'fs';
import { terminalLogger } from './terminalLogger.js';
import { basename, join } from 'path';
import { showOsInformation } from './osInteraction.js';
import { calculateHash } from './hashCalculation.js';
import { compress, decompress } from './zlib.js';

class CommandController {
  async readLine(line) {
    const inputArr = getInputArr(line);
    const firstCommand = inputArr[0];
    const commandOptions = inputArr.slice(1);

    switch (firstCommand) {
      case 'up':
        this.changeDir(['../']);
        break;
      case 'cd':
        this.changeDir(commandOptions);
        break;
      case 'ls':
        await this.showDirFiles();
        break;
      case 'cat':
        await this.readFile(commandOptions);
        break;
      case 'add':
        await this.createFile(commandOptions);
        break;
      case 'rn':
        await this.renameFile(commandOptions);
        break;
      case 'cp':
        await this.copyFile(commandOptions);
        break;
      case 'mv':
        await this.copyFile(commandOptions, true);
        break;
      case 'rm':
        await this.deleteFile(commandOptions);
        break;
      case 'os':
        showOsInformation(commandOptions);
        break;
      case 'hash':
        await calculateHash(commandOptions);
        break;
      case 'compress':
        await compress(commandOptions);
        break;
      case 'decompress':
        await decompress(commandOptions);
        break;
      default:
        terminalLogger.invalidInput();
        break;
    }
  }

  changeDir(path) {
    try {
      chdir(path[0]);
    } catch {
      terminalLogger.operationFailed();
    }
  }

  async showDirFiles() {
    return new Promise((resolve) => {
      fs.readdir(cwd(), (err, files) => {
        if (err) {
          terminalLogger.operationFailed();
        }
        console.log(files);
        resolve();
      });
    });
  }

  async readFile(pathArr) {
    try {
      const path = pathArr[0];
      const pathToFile = getAbsolutePath(path);

      return new Promise((resolve) => {
        const readStream = fs.createReadStream(pathToFile, 'utf-8');
        const data = [];

        readStream.on('readable', () => {
          let chunk;
          while (null !== (chunk = readStream.read())) {
            data.push(chunk);
          }
        });

        readStream.on('end', () => {
          const content = data.join('');
          console.log(content);
          resolve();
        });

        readStream.on('error', () => {
          terminalLogger.operationFailed();
          resolve();
        });
      });
    } catch {
      terminalLogger.operationFailed();
    }
  }

  async createFile(commandOptions) {
    return new Promise((resolve) => {
      try {
        const filePath = join(cwd(), commandOptions[0]);
        const writeStream = fs.createWriteStream(filePath);
        writeStream.on('ready', () => {
          terminalLogger.newFileCreated(commandOptions[0]);
          resolve();
        });
        writeStream.on('error', () => {
          terminalLogger.operationFailed();
          resolve();
        });
      } catch {
        terminalLogger.operationFailed();
      }
    });
  }

  async renameFile(commandOptions) {
    return new Promise((resolve) => {
      try {
        const pathToFile = getAbsolutePath(commandOptions[0]);
        const newFileName = commandOptions[1];
        fs.rename(pathToFile, newFileName, (err) => {
          if (err) {
            terminalLogger.operationFailed();
            resolve();
          } else {
            terminalLogger.fileNameChanged();
            resolve();
          }
        });
      } catch {
        terminalLogger.operationFailed();
        resolve();
      }
    });
  }

  async copyFile(commandOptions, deleteAfter = false) {
    return new Promise((resolve) => {
      try {
        const oldPathToFile = getAbsolutePath(commandOptions[0]);
        const fileName = basename(oldPathToFile);
        const newPathToFile = join(
          getAbsolutePath(join(commandOptions[1], fileName)),
        );

        fs.access(oldPathToFile, (err) => {
          if (err) {
            terminalLogger.operationFailed();
            resolve();
            return;
          }

          const readable = fs.createReadStream(oldPathToFile, {
            encoding: 'utf8',
          });

          const writable = fs.createWriteStream(newPathToFile);

          readable.on('error', () => {
            terminalLogger.operationFailed();
            resolve();
          });

          writable.on('error', () => {
            terminalLogger.operationFailed();
            resolve();
          });

          readable.pipe(writable).on('finish', () => {
            if (deleteAfter) {
              fs.unlink(oldPathToFile, (err) => {
                if (err) {
                  terminalLogger.operationFailed();
                  resolve();
                } else {
                  terminalLogger.movingCompleted();
                  resolve();
                }
              });
            } else {
              terminalLogger.copyingCompleted();
              resolve();
            }
          });
        });
      } catch {
        terminalLogger.operationFailed();
        resolve();
      }
    });
  }

  async deleteFile(pathArr) {
    try {
      const path = getAbsolutePath(pathArr[0]);
      return new Promise((resolve) => {
        fs.unlink(path, (err) => {
          if (err) {
            terminalLogger.operationFailed();
            resolve();
          } else {
            terminalLogger.removeCompleted();
            resolve();
          }
        });
      });
    } catch {
      terminalLogger.operationFailed();
    }
  }
}

export const commandController = new CommandController();
