import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDataModule } from 'src/user-data/user-data.module';

import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserDataModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
