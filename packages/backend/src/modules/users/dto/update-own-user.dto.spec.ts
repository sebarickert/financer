import { Theme } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateOwnUserDto } from './update-own-user.dto';

describe('UpdateOwnUserDto', () => {
  const validUpdateOwnUser = {
    name: 'John Doe',
    nickname: 'Johnny',
    profileImageUrl: null,
    theme: 'AUTO' as Theme,
  };

  describe('constructor', () => {
    it('should create a valid UpdateOwnUserDto instance', () => {
      const dto = new UpdateOwnUserDto(validUpdateOwnUser);

      expect(dto).toBeDefined();
      expect(dto.name).toEqual(validUpdateOwnUser.name);
      expect(dto.nickname).toEqual(validUpdateOwnUser.nickname);
      expect(dto.profileImageUrl).toEqual(validUpdateOwnUser.profileImageUrl);
      expect(dto.theme).toEqual(validUpdateOwnUser.theme);
    });

    it('should create a partial instance with some fields', () => {
      const partialData = { theme: 'DARK' as Theme };
      const dto = new UpdateOwnUserDto(partialData);

      expect(dto).toBeDefined();
      expect(dto.theme).toEqual(partialData.theme);
      expect(dto.name).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid full DTO', async () => {
      const dto = plainToInstance(UpdateOwnUserDto, validUpdateOwnUser);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate a partial DTO', async () => {
      const partialDto = plainToInstance(UpdateOwnUserDto, {
        nickname: 'new-nick',
      });

      const errors = await validate(partialDto);
      expect(errors).toHaveLength(0);
    });

    it('should validate an empty DTO (all fields optional)', async () => {
      const emptyDto = plainToInstance(UpdateOwnUserDto, {});

      const errors = await validate(emptyDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid field value', async () => {
      const invalidDto = plainToInstance(UpdateOwnUserDto, {
        name: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });
  });
});
