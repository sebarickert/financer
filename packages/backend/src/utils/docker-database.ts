import { execSync } from 'child_process';

import { Logger } from '@nestjs/common';

export class DockerDatabase {
  private static readonly logger = new Logger(DockerDatabase.name);

  private static readonly IMAGE_TAG = 'postgres:17-alpine';

  public static isContainerExists(name: string): boolean {
    try {
      execSync(`docker inspect ${name}`);
      return true;
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Failed to check if container ${name} exists: ${(error as any).message}`,
      );
      return false;
    }
  }

  public static isContainerRunning(name: string): boolean {
    try {
      const result = execSync(`docker inspect -f '{{.State.Running}}' ${name}`)
        .toString()
        .trim();
      return result === 'true';
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Failed to check if container ${name} is running: ${(error as any).message}`,
      );
      return false;
    }
  }

  public static removeContainer(name: string): void {
    try {
      execSync(`docker rm -f ${name}`);
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Failed to remove container ${name}: ${(error as any).message}`,
      );
    }
  }

  public static async createContainer(
    name: string,
    username: string,
    password: string,
    port: number,
  ): Promise<void> {
    try {
      execSync(
        `docker run --name ${name} -e POSTGRES_USER=${username} -e POSTGRES_PASSWORD=${password} -p ${port}:5432 -d ${this.IMAGE_TAG}`,
      );
      await this.waitForContainer(name);
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Failed to create container ${name}: ${(error as any).message}`,
      );
    }
  }

  public static async startContainer(name: string): Promise<void> {
    try {
      execSync(`docker start ${name}`);
      await this.waitForContainer(name);
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Failed to start container ${name}: ${(error as any).message}`,
      );
    }
  }

  private static async waitForContainer(name: string): Promise<void> {
    let isRunning = false;
    const maxRetries = 60;
    let retries = 0;

    while (!isRunning && retries < maxRetries) {
      try {
        execSync(`docker exec ${name} pg_isready`);
        isRunning = true;
      } catch (error) {
        retries++;
        this.logger.log(
          `Waiting for the database to be ready... (${retries}/${maxRetries})`,
        );

        await this.sleep(1000);
      }
    }

    if (!isRunning) {
      throw new Error('Database container is not ready');
    }

    this.logger.log('Database container is ready');
  }

  private static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
