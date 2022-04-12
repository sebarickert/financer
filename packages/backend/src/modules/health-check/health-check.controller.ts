import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  @Get('ping')
  stuff() {
    return { ping: 'pong' };
  }
}
