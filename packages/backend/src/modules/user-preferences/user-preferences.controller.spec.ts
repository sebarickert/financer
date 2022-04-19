import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  UserPreference,
  UserPreferenceSchema,
} from './schemas/user-preference.schema';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesController', () => {
  let controller: UserPreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: UserPreference.name, schema: UserPreferenceSchema },
        ]),
      ],
      controllers: [UserPreferencesController],
      providers: [UserPreferencesService],
    }).compile();

    controller = module.get<UserPreferencesController>(
      UserPreferencesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
