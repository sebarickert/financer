import { test as setup } from "@playwright/test";
import { spawn, ChildProcessWithoutNullStreams, exec } from 'child_process';

const BASE_PORT = 3100

const getWorkerCountByCpu = () => {
  const cpuCount = require('os').cpus().length;

  return Math.ceil(cpuCount / 2);
}

export const getWorkerCount = () => getWorkerCountByCpu()

export const parsePort = (testIndex: number) => BASE_PORT + testIndex;

export const startServer = async (workerIndex: number): Promise<ChildProcessWithoutNullStreams> => {
      const serverProcess = spawn('node', ['../../build/server/main.js'], {
        env: {
          PORT: parsePort(workerIndex).toString(),
          NODE_ENV: "test",
          PATH: process.env.PATH,
        },
      });
  
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server stderr: ${data}`);
    });
    
    return new Promise((resolve) => {
        serverProcess.stdout.on('data', (data) => {
            if (data.toString().includes('Nest application successfully started')) {
                resolve(serverProcess);
            }
        });
    });
  };

