import { Module } from '@nestjs/common';

import { IncomesController } from './incomes.controller';

@Module({
  controllers: [IncomesController],
})
export class IncomesModule {}
