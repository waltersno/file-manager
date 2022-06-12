import { join, isAbsolute } from 'path';
import { cwd } from 'process';

export const getUserName = (envVariablesArr) => {
  const parameters = envVariablesArr.slice(2);
  const userName = parameters[0].slice(2).split('=').pop();
  return userName;
};

export const getInputArr = (command) => {
  return command.split(' ');
};

export const getAbsolutePath = (path) => {
  return isAbsolute(path) ? path : join(cwd(), path)
};
