import memoryDatabaseServer from "../config/MemoryDatabaseServer";

export default async (): Promise<void> => memoryDatabaseServer.start();
