import { Injectable } from '@nestjs/common';
import { SystemLog } from '@prisma/client';

import { SystemLogRepo } from '../../database/repos/system-log.repo';

import { CreateSystemLogDto } from './dto/create-system-log.dto';

@Injectable()
export class SystemService {
  constructor(private readonly systemLogRepo: SystemLogRepo) {}

  async getLogs(start: Date, end: Date): Promise<SystemLog[]> {
    return this.systemLogRepo.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSystemLogEntry(logEntry: CreateSystemLogDto) {
    return this.systemLogRepo.create(logEntry);
  }
}
