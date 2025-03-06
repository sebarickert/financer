import { UserPreferenceProperty } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateUserPreferenceDto } from './create-user-preference.dto';

describe('CreateUserPreferenceDto', () => {
  const validCreatePreference = {
    key: UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
    value: 'dark',
  };

  describe('constructor', () => {
    it('should create a valid CreateUserPreferenceDto instance', () => {
      const dto = new CreateUserPreferenceDto(validCreatePreference);

      expect(dto).toBeDefined();
      expect(dto.key).toEqual(validCreatePreference.key);
      expect(dto.value).toEqual(validCreatePreference.value);
    });

    it('should create an empty instance when no data is provided', () => {
      const dto = new CreateUserPreferenceDto();

      expect(dto).toBeDefined();
      expect(dto.key).toBeUndefined();
      expect(dto.value).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(
        CreateUserPreferenceDto,
        validCreatePreference,
      );
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid key', async () => {
      const invalidDto = plainToInstance(CreateUserPreferenceDto, {
        ...validCreatePreference,
        key: 'INVALID_KEY' as UserPreferenceProperty,
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('key');
    });

    it('should fail validation with empty value', async () => {
      const invalidDto = plainToInstance(CreateUserPreferenceDto, {
        ...validCreatePreference,
        value: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('value');
    });
  });
});
