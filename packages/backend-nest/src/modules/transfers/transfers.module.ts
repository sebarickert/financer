import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';

@Module({
  controllers: [TransfersController]
})
export class TransfersModule {}
