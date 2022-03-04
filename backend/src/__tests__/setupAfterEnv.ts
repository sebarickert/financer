import { connect, truncate, disconnect } from '../config/MemoryDatabaseServer';

beforeAll(async () => {
  return connect();
});

beforeEach(async () => {
  return truncate();
});

afterAll(async () => {
  return disconnect();
});
