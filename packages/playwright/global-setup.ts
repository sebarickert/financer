import { ChildProcessWithoutNullStreams } from 'child_process';

import { getWorkerCount, startServer } from '@/utils/setup';

const setup = async () => {
  const workerCount = getWorkerCount();

  (
    global as unknown as Record<
      'workerServers',
      ChildProcessWithoutNullStreams[] | undefined
    >
  ).workerServers = (
    await Promise.all(
      Array.from(Array(workerCount).keys()).map((index) => startServer(index)),
    )
  ).flat();
};

// eslint-disable-next-line import/no-default-export
export default setup;
