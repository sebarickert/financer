import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@silte/nestjs-swagger';

@Controller('health-check')
@ApiTags('Health Check')
export class HealthCheckController {
  @Get('ping')
  @ApiOkResponse({ schema: { properties: { ping: { type: 'string' } } } })
  stuff() {
    return { ping: 'pong' };
  }
}
