import { UserPreferenceProperty } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateUserPreferenceDto } from './update-user-preference.dto';

describe('UpdateUserPreferenceDto', () => {
  const validUpdatePreference = {
    key: UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
    value: 'light',
  };

  describe('constructor', () => {
    it('should create a valid UpdateUserPreferenceDto instance', () => {
      const dto = new UpdateUserPreferenceDto(validUpdatePreference);

      expect(dto).toBeDefined();
      expect(dto.key).toEqual(validUpdatePreference.key);
      expect(dto.value).toEqual(validUpdatePreference.value);
    });

    it('should create an empty instance when no data is provided', () => {
      const dto = new UpdateUserPreferenceDto();

      expect(dto).toBeDefined();
      expect(dto.key).toBeUndefined();
      expect(dto.value).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(
        UpdateUserPreferenceDto,
        validUpdatePreference,
      );
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid key', async () => {
      const invalidDto = plainToInstance(UpdateUserPreferenceDto, {
        ...validUpdatePreference,
        key: 'INVALID_KEY' as UserPreferenceProperty,
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('key');
    });

    it('should fail validation with empty value', async () => {
      const invalidDto = plainToInstance(UpdateUserPreferenceDto, {
        ...validUpdatePreference,
        value: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('value');
    });
  });
});
