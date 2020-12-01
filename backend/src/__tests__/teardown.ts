import MemoryDatabaseServer from "../config/MemoryDatabaseServer";

export default async (): Promise<void> => MemoryDatabaseServer.stop();
