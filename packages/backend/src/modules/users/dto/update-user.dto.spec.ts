import { Theme } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  const validUpdateUser = {
    name: 'John Doe',
    nickname: 'Johnny',
    githubId: null,
    auth0Id: null,
    profileImageUrl: null,
    theme: 'AUTO' as Theme,
  };

  describe('constructor', () => {
    it('should create a valid UpdateUserDto instance', () => {
      const dto = new UpdateUserDto(validUpdateUser);

      expect(dto).toBeDefined();
      expect(dto.name).toEqual(validUpdateUser.name);
      expect(dto.nickname).toEqual(validUpdateUser.nickname);
      expect(dto.profileImageUrl).toEqual(validUpdateUser.profileImageUrl);
      expect(dto.theme).toEqual(validUpdateUser.theme);
    });

    it('should create a partial instance with some fields', () => {
      const partialData = { name: 'Partial Update' };
      const dto = new UpdateUserDto(partialData);

      expect(dto).toBeDefined();
      expect(dto.name).toEqual(partialData.name);
      expect(dto.nickname).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid full DTO', async () => {
      const dto = plainToInstance(UpdateUserDto, validUpdateUser);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate a partial DTO', async () => {
      const partialDto = plainToInstance(UpdateUserDto, {
        name: 'Partial Update',
      });

      const errors = await validate(partialDto);
      expect(errors).toHaveLength(0);
    });

    it('should validate an empty DTO (all fields optional)', async () => {
      const emptyDto = plainToInstance(UpdateUserDto, {});

      const errors = await validate(emptyDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid field value', async () => {
      const invalidDto = plainToInstance(UpdateUserDto, {
        name: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });
  });
});
