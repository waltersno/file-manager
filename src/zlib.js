import fs from 'fs';
import { terminalLogger } from './terminalLogger.js';
import { getAbsolutePath } from './utils.js';
import zlib from 'zlib';
import { extname } from 'path';

export const compress = (pathArr) => {
  return new Promise((resolve) => {
    try {
      const oldPathToFile = getAbsolutePath(pathArr[0]);
      const newPathToFile = getAbsolutePath(pathArr[1]);

      if (!extname(newPathToFile).trim()) {
        terminalLogger.giveExtName();
        resolve();
        return;
      }

      const readStream = fs.createReadStream(oldPathToFile);
      const writeStream = fs.createWriteStream(newPathToFile);
      const brotli = zlib.createBrotliCompress();
      const stream = readStream.pipe(brotli).pipe(writeStream);

      const errorHandler = () => {
        readStream.destroy();
        writeStream.destroy();
        stream.destroy();
        terminalLogger.operationFailed();
        resolve();
        return;
      };

      readStream.on('error', errorHandler);

      writeStream.on('error', errorHandler);

      stream.on('error', errorHandler);

      stream.on('finish', () => {
        console.log('Done compressing');
        resolve();
      });
    } catch {
      terminalLogger.operationFailed();
      resolve();
    }
  });
};

export const decompress = (pathArr) => {
  return new Promise((resolve) => {
    try {
      const compressPath = getAbsolutePath(pathArr[0]);
      const decompressPath = getAbsolutePath(pathArr[1]);

      const readStream = fs.createReadStream(compressPath);
      const writeStream = fs.createWriteStream(decompressPath);
      const brotli = zlib.createBrotliDecompress();
      const stream = readStream.pipe(brotli).pipe(writeStream);

      const errorHandler = () => {
        terminalLogger.operationFailed();
        resolve();
      };

      brotli.on('error', errorHandler);

      readStream.on('error', errorHandler);

      writeStream.on('error', errorHandler);

      stream.on('error', errorHandler);

      stream.on('finish', () => {
        console.log('Done decompressing');
        resolve();
      });
    } catch {
      terminalLogger.operationFailed();
      resolve();
    }
  });
};
