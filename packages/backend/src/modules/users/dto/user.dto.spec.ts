import { Theme } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UserDto } from './user.dto';

describe('UserDto', () => {
  const validDto = {
    id: 'eed3f48b-04d4-453a-8a14-80f8fed12e31',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'John Doe',
    nickname: 'Johnny',
    githubId: null,
    auth0Id: null,
    profileImageUrl: null,
    roles: [],
    theme: 'AUTO' as Theme,
  };

  describe('constructor', () => {
    it('should create a valid DTO instance with all properties', () => {
      const dto = new UserDto(validDto);

      expect(dto).toBeDefined();
      expect(dto.id).toEqual(validDto.id);
      expect(dto.createdAt).toEqual(validDto.createdAt);
      expect(dto.updatedAt).toEqual(validDto.updatedAt);
      expect(dto.name).toEqual(validDto.name);
      expect(dto.nickname).toEqual(validDto.nickname);
      expect(dto.githubId).toEqual(validDto.githubId);
      expect(dto.auth0Id).toEqual(validDto.auth0Id);
      expect(dto.profileImageUrl).toEqual(validDto.profileImageUrl);
    });

    it('should create an empty DTO instance when no data is provided', () => {
      const dto = new UserDto();

      expect(dto).toBeDefined();
      expect(dto.id).toBeUndefined();
      expect(dto.createdAt).toBeUndefined();
      expect(dto.updatedAt).toBeUndefined();
      expect(dto.name).toBeUndefined();
      expect(dto.nickname).toBeUndefined();
      expect(dto.githubId).toBeUndefined();
      expect(dto.auth0Id).toBeUndefined();
      expect(dto.profileImageUrl).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid full DTO', async () => {
      const dto = plainToInstance(UserDto, validDto);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
