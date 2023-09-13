
import { ChildProcessWithoutNullStreams } from 'child_process';

const teardown = async () => {
    const workerServers: ChildProcessWithoutNullStreams[] = global.workerServers;

    workerServers.forEach((server) => {
        server.kill();
    });
}

export default teardown;