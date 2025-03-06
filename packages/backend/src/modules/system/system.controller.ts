import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';

import { SystemService } from './system.service';

import { Auth } from '@/auth/decorators/auth.decorator';

@Controller('api/system')
@Auth(Role.ADMIN)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  private static getMonthAgo(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  @Get('logs')
  async getLogs(
    @Query('start', new DefaultValuePipe(SystemController.getMonthAgo()))
    start: Date,
    @Query('end', new DefaultValuePipe(new Date())) end: Date,
  ) {
    return this.systemService.getLogs(start, end);
  }
}
