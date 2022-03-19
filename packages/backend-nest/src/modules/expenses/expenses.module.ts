import { Module } from '@nestjs/common';

import { ExpensesController } from './expenses.controller';

@Module({
  controllers: [ExpensesController],
})
export class ExpensesModule {}
