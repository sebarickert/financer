import { ChildProcessWithoutNullStreams } from 'child_process';

const teardown = () => {
  const workerServers =
    (
      global as unknown as Record<
        'workerServers',
        ChildProcessWithoutNullStreams[] | undefined
      >
    ).workerServers ?? [];

  workerServers.forEach((server) => {
    server.kill();
  });
};

// eslint-disable-next-line import/no-default-export
export default teardown;
