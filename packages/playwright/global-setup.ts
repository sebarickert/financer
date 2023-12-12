import { getWorkerCount, startServer } from "$utils/setup";


const setup = async () => {
    const workerCount = getWorkerCount();

    // if (process.env.DEBUG) {
    //     global.workerServers = [];
    // } else {   
    global.workerServers = await Promise.all(Array.from(Array(workerCount).keys()).map((index) => startServer(index)));
    // }
}

export default setup;