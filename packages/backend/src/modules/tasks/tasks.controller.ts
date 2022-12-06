import { Controller, Get } from '@nestjs/common';

import { TasksService } from './tasks.service';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('generate-transactions')
  async generateTransactions() {
    return this.tasksService.generateTransactions();
  }
}
