import { Theme } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const validCreateUser = {
    name: 'John Doe',
    nickname: 'Johnny',
    githubId: null,
    auth0Id: null,
    profileImageUrl: null,
    roles: [],
    theme: 'AUTO' as Theme,
  };

  describe('constructor', () => {
    it('should create a valid CreateUserDto instance', () => {
      const dto = new CreateUserDto(validCreateUser);

      expect(dto).toBeDefined();
      expect(dto.name).toEqual(validCreateUser.name);
      expect(dto.nickname).toEqual(validCreateUser.nickname);
      expect(dto.profileImageUrl).toEqual(validCreateUser.profileImageUrl);
      expect(dto.theme).toEqual(validCreateUser.theme);
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(CreateUserDto, validCreateUser);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const invalidDto = plainToInstance(CreateUserDto, {
        ...validCreateUser,
        name: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });
  });
});
