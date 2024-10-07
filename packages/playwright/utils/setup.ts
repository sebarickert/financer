import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { cpus } from 'os';

const BASE_FRONTEND_PORT = 3100;
const BASE_BACKEND_PORT = 3200;

const getWorkerCountByCpu = () => {
  const cpuCount = cpus().length;

  return Math.ceil(cpuCount / 2);
};

export const getExternalTestServerUrl = () => process.env.TEST_SERVER_URL;

const hasExternalServer = () => !!getExternalTestServerUrl();

export const getWorkerCount = () =>
  process.env.CI || hasExternalServer() ? 1 : getWorkerCountByCpu();

const parseBackendPort = (testIndex: number) => BASE_BACKEND_PORT + testIndex;

export const parsePort = (testIndex: number) => BASE_FRONTEND_PORT + testIndex;

export const startServer = async (
  workerIndex: number,
): Promise<
  [ChildProcessWithoutNullStreams, ChildProcessWithoutNullStreams] | []
> => {
  if (hasExternalServer()) {
    return Promise.resolve([]);
  }

  const backendPort = parseBackendPort(workerIndex);
  const frontendPort = parsePort(workerIndex);

  const backendProcess = spawn('node', ['build/backend/main.js'], {
    cwd: '../../',
    env: {
      PORT: backendPort.toString(),
      NODE_ENV: 'test',
      PATH: process.env.PATH,
      SCHEMA: 'packages/backend/prisma/schema.prisma',
      // In CI, we have action service that runs the postgres container
      // and we have to initialize the schema and test user
      INITIALIZE_SCHEMA_AND_TEST_USER:
        process.env.INITIALIZE_SCHEMA_AND_TEST_USER,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
    },
  });

  const frontendProcess = spawn('node', ['build/frontend/server.js'], {
    cwd: '../../',
    env: {
      PORT: frontendPort.toString(),
      INTERNAL_API_ROOT_ADDRESS: `http://localhost:${backendPort}`,
      NODE_ENV: 'production',
      PATH: process.env.PATH,
    },
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend stderr: ${data}`);
  });

  const showBackendOutput = process.env.SHOW_BACKEND_OUTPUT === 'true';
  if (showBackendOutput) {
    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend stdout: ${data}`);
    });
  }

  frontendProcess.stderr.on('data', (data) => {
    console.error(`Frontend stderr: ${data}`);
  });

  const backendProcessStartup = new Promise<ChildProcessWithoutNullStreams>(
    (resolve) => {
      backendProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Nest application successfully started')) {
          resolve(backendProcess);
        }
      });
    },
  );

  const frontendProcessStartup = new Promise<ChildProcessWithoutNullStreams>(
    (resolve) => {
      frontendProcess.stdout.on('data', (data) => {
        if (/Ready in \d+ms/.test(data.toString())) {
          resolve(frontendProcess);
        }
      });
    },
  );

  return Promise.all([frontendProcessStartup, backendProcessStartup]);
};
