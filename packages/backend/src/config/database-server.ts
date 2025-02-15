import { execSync } from 'child_process';

import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

import {
  shouldOnlyExportApiSpec,
  shouldUseInternalDevelopmentDockerDb,
} from './configuration';
import { DUMMY_TEST_USER } from './mockAuthenticationMiddleware';

import { DockerDatabase } from '@/utils/docker-database';

const DEVELOPMENT_DB_PORT = 5432;
const TEST_DB_PORT = 39425;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseServer {
  private static readonly logger = new Logger(DatabaseServer.name);

  private static readonly USERNAME = 'admin';

  private static readonly PASSWORD = 'change-me';

  public static readonly startServer = async (): Promise<void> => {
    const name = this.getContainerName();

    if (DockerDatabase.isContainerRunning(name)) {
      this.logger.verbose('PostgreSQL Docker container is already running.');
      return;
    } else if (DockerDatabase.isContainerExists(name)) {
      this.logger.verbose('Starting existing PostgreSQL Docker container.');
      await DockerDatabase.startContainer(name);
    }

    await DockerDatabase.createContainer(
      name,
      this.USERNAME,
      this.PASSWORD,
      this.getPort(),
    );
  };

  public static readonly stopServer = (): void => {
    const name = this.getContainerName();

    if (DockerDatabase.isContainerExists(name)) {
      this.logger.log(`Stopping PostgreSQL Docker container ${name}`);
      DockerDatabase.removeContainer(name);
    }
  };

  public static readonly setupTestDatabase = async (
    uriInput?: string,
  ): Promise<string> => {
    const uri = uriInput ?? this.getDbUri();

    await this.ensureDatabaseExists(uri);
    this.setupDatabaseSchema(uri);
    await this.ensureTestUserExists(uri);

    return uri;
  };

  public static readonly setupDevelopmentDatabase =
    async (): Promise<string> => {
      const uri = this.getDbUri();

      await this.ensureDatabaseExists(uri);
      this.setupDatabaseSchema(uri);

      return uri;
    };

  private static readonly getIsDevelopment = (): boolean => {
    return shouldUseInternalDevelopmentDockerDb() || shouldOnlyExportApiSpec();
  };

  private static readonly getContainerName = (): string => {
    const isDevelopment = this.getIsDevelopment();

    return isDevelopment
      ? 'financer-development-postgres'
      : 'financer-test-postgres';
  };

  private static getDbUri(): string {
    const databaseName = this.getIsDevelopment()
      ? 'financer_dev'
      : `test_db_${process.pid}`;

    return `postgresql://${this.USERNAME}:${this.PASSWORD}@localhost:${this.getPort()}/${databaseName}`;
  }

  private static getPort(): number {
    return this.getIsDevelopment() ? DEVELOPMENT_DB_PORT : TEST_DB_PORT;
  }

  private static async ensureDatabaseExists(uriInput: string): Promise<void> {
    const uri = new URL(uriInput);
    const dbName = uri.pathname.split('/').pop();
    uri.pathname = '/postgres';

    const client = new Client({ connectionString: uri.toString() });
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      this.logger.log(`Database ${dbName} created.`);
    }

    await client.end();
  }

  private static readonly ensureTestUserExists = async (
    dbUri: string,
  ): Promise<void> => {
    const prisma = new PrismaClient({ datasources: { db: { url: dbUri } } });

    await prisma.user.upsert({
      where: { id: DUMMY_TEST_USER.id },
      update: {},
      create: DUMMY_TEST_USER,
    });

    await prisma.$disconnect();
  };

  private static readonly setupDatabaseSchema = (rawUri: string): void => {
    execSync(`npx prisma db push --schema=$SCHEMA --skip-generate`, {
      // Uncomment to see command output
      // Stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: rawUri },
    });
  };
}
