import { connect, truncate, disconnect } from "../config/MemoryDatabaseServer";

beforeAll(() => {
  return connect();
});

beforeEach(() => {
  return truncate();
});

afterAll(() => {
  return disconnect();
});
