import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateSystemLogDto } from './dto/create-system-log.dto';
import { SystemLog, SystemLogDocument } from './schemas/system-log.schema';

@Injectable()
export class SystemService {
  constructor(
    @InjectModel(SystemLog.name)
    private systemLogModel: Model<SystemLogDocument>,
  ) {}

  async getLogs(startDate: Date, endDate: Date): Promise<SystemLogDocument[]> {
    const start =
      startDate.toString() !== 'Invalid Date'
        ? startDate
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

    const end = endDate.toString() !== 'Invalid Date' ? endDate : new Date();

    return this.systemLogModel
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async createSystemLogEntry(logEntry: CreateSystemLogDto) {
    const systemLogEntry = new this.systemLogModel(logEntry);
    return systemLogEntry.save();
  }
}
