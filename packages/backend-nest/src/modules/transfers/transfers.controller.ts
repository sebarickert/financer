import { Controller, Get } from '@nestjs/common';

@Controller('api/transfers')
export class TransfersController {
  @Get()
  getAllUserTransfers() {
    return '@TODO';
  }
}
