import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';

import { Auth } from '../auth/decorators/auht.decorator';

import { SystemService } from './system.service';

@Controller('api/system')
@Auth(Role.ADMIN)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('logs')
  async getLogs(@Query('start') start: Date, @Query('end') end: Date) {
    return this.systemService.getLogs(start, end);
  }
}
