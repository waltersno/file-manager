import fs from 'fs';
import crypto from 'crypto';
import { getAbsolutePath } from './utils.js';
import { terminalLogger } from './terminalLogger.js';

export const calculateHash = (pathArr) => {
  return new Promise((resolve) => {
    try {
      const path = getAbsolutePath(pathArr[0]);
      const input = fs.createReadStream(path);
      const hash = crypto.createHash('sha256');
      hash.setEncoding('hex');

      input.on('error', () => {
        terminalLogger.operationFailed();
        resolve();
      });

      input.on('end', () => {
        hash.end();
        console.log(hash.read());
        resolve();
      });

      input.pipe(hash);
    } catch {
      terminalLogger.operationFailed();
      resolve();
    }
  });
};
