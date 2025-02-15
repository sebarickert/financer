import { Module, forwardRef } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { DatabaseModule } from '@/database/database.module';
import { UserDataModule } from '@/user-data/user-data.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserDataModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
