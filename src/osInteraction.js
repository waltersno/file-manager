import { EOL, cpus, homedir, userInfo, arch } from 'os';
import { terminalLogger } from './terminalLogger.js';

const showEOL = () => {
  console.log(JSON.stringify(EOL));
};

const showCpus = () => {
  let speedDivider = 1000;
  if (arch() === 'arm64') {
    speedDivider = 10;
  }
  const cpuArrRaw = cpus();
  const cpuArr = cpuArrRaw.map(({ model, speed }) => ({
    model,
    speed: speed / speedDivider,
  }));
  console.log(`Number of CPUs: ${cpuArr.length}`);
  console.log(cpuArr);
};

const showHomedir = () => {
  console.log(homedir());
};

const showUsername = () => {
  console.log(userInfo().username);
};

const showArchitecture = () => {
  console.log(arch());
};

export const showOsInformation = (commandArr) => {
  const command = commandArr[0];
  if (command) {
    switch (command) {
      case '--EOL':
        showEOL();
        break;
      case '--cpus':
        showCpus();
        break;
      case '--homedir':
        showHomedir();
        break;
      case '--username':
        showUsername();
        break;
      case '--architecture':
        showArchitecture();
        break;
      default:
        terminalLogger.operationFailed();
        break;
    }
  } else {
    terminalLogger.operationFailed();
  }
};
