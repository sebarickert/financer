import { UserPreferenceProperty } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UserPreferenceDto } from './user-preference.dto';

import { UserId } from '@/types/user-id';

describe('UserPreferenceDto', () => {
  const userId = '700b48b9-2e9b-4f55-a79d-9a2d917416ce' as UserId;
  const now = new Date();

  const validUserPreference = {
    id: '413649f6-e095-474c-8f4c-e5d4e54654de',
    userId,
    key: UserPreferenceProperty.DASHBOARD_SETTINGS,
    value: 'dark',
    createdAt: now,
    updatedAt: now,
  };

  describe('constructor', () => {
    it('should create a valid UserPreferenceDto instance', () => {
      const dto = new UserPreferenceDto(validUserPreference);

      expect(dto).toBeDefined();
      expect(dto.id).toEqual(validUserPreference.id);
      expect(dto.userId).toEqual(validUserPreference.userId);
      expect(dto.key).toEqual(validUserPreference.key);
      expect(dto.value).toEqual(validUserPreference.value);
      expect(dto.createdAt).toEqual(validUserPreference.createdAt);
      expect(dto.updatedAt).toEqual(validUserPreference.updatedAt);
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(UserPreferenceDto, validUserPreference);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid id', async () => {
      const invalidDto = plainToInstance(UserPreferenceDto, {
        ...validUserPreference,
        id: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with invalid userId', async () => {
      const invalidDto = plainToInstance(UserPreferenceDto, {
        ...validUserPreference,
        userId: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with invalid key', async () => {
      const invalidDto = plainToInstance(UserPreferenceDto, {
        ...validUserPreference,
        key: 'INVALID_KEY' as UserPreferenceProperty,
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('key');
    });

    it('should fail validation with empty value', async () => {
      const invalidDto = plainToInstance(UserPreferenceDto, {
        ...validUserPreference,
        value: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('value');
    });
  });

  describe('createFromPlain', () => {
    it('should create a DTO from plain object', () => {
      const dto = UserPreferenceDto.createFromPlain(validUserPreference);

      expect(dto).toBeInstanceOf(UserPreferenceDto);
      expect(dto.id).toEqual(validUserPreference.id);
      expect(dto.userId).toEqual(validUserPreference.userId);
      expect(dto.key).toEqual(validUserPreference.key);
      expect(dto.value).toEqual(validUserPreference.value);
    });

    it('should create an array of DTOs from an array of plain objects', () => {
      const plainPreferences = [validUserPreference, validUserPreference];

      const dtos = UserPreferenceDto.createFromPlain(plainPreferences);

      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(UserPreferenceDto);
      expect(dtos[1]).toBeInstanceOf(UserPreferenceDto);
    });
  });
});
