import { getWorkerCount, startServer } from "$utils/setup";


const setup = async () => {
    const workerCount = getWorkerCount();


    global.workerServers = (await Promise.all(Array.from(Array(workerCount).keys()).map((index) => startServer(index)))).flat();
}

export default setup;